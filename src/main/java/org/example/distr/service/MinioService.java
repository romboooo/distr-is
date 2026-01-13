package org.example.distr.service;

import io.minio.*;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.val;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Getter
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket.covers}")
    private String coversBucket;

    @Value("${minio.bucket.songs}")
    private String songsBucket;

    @Value("${minio.auto-create-buckets}")
    private boolean autoCreateBuckets;

    private Logger logger = LoggerFactory.getLogger(MinioService.class);

    @PostConstruct
    public void init() {
        if (autoCreateBuckets) {
            createBucketsIfNotExists();
        }
    }

    private void createBucketsIfNotExists() {
        List.of(coversBucket, songsBucket).forEach((bucketName) -> {
            try {
                var bucketExistsArgs = BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build();

                if (!minioClient.bucketExists(bucketExistsArgs)) {
                    val makeBucketArgs = MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build();

                    minioClient.makeBucket(makeBucketArgs);
                    logger.info("Bucket {}} created successfully", bucketName);
                } else {
                    logger.info("Bucket {} already exists");
                }
            } catch (Exception e) {
                logger.error("Failed to create bucket {}", bucketName);
                throw new RuntimeException("Bucket initialization failed", e);
            }
        });
    }

    public String uploadFile(String bucketName, String fileName, MultipartFile file) throws Exception {
        return uploadFile(bucketName, fileName, file.getInputStream(), file.getSize(), file.getContentType());
    }

    private String uploadFile(String bucketName, String fileName,
            InputStream inputStream,
            long size,
            String contentType) throws Exception {

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(fileName)
                        .stream(inputStream, size, -1)
                        .contentType(contentType)
                        .build());
        return fileName;
    }

    public String uploadFile(String bucketName, String fileName, File file) throws Exception {
        try (InputStream inputStream = new FileInputStream(file)) {
            String contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return uploadFile(bucketName, fileName, inputStream, file.length(), contentType);
        }
    }

    public void moveFile(String sourceBucket, String destinationBucket, String objectName) throws Exception {
        try {
            // Copy file to destination bucket
            minioClient.copyObject(
                    CopyObjectArgs.builder()
                            .source(CopySource.builder().bucket(sourceBucket).object(objectName).build())
                            .bucket(destinationBucket)
                            .object(objectName)
                            .build());

            // Delete from source bucket
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(sourceBucket)
                            .object(objectName)
                            .build());

            log.info("Successfully moved file from {} to {}", sourceBucket, destinationBucket);
        } catch (Exception e) {
            log.error("Error moving file between buckets: {}", e.getMessage());
            throw new RuntimeException("Failed to move file between buckets", e);
        }
    }

    public InputStream downloadFile(String bucket, String objectName) throws Exception {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build());
        } catch (Exception e) {
            log.error("Error downloading file from MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to download file", e);
        }
    }

    public String getFileContentType(String bucket, String objectName) throws Exception {
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build());
            return stat.contentType();
        } catch (Exception e) {
            log.error("Error getting content type from MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to get file metadata", e);
        }
    }

    public StatObjectResponse statObject(String bucket, String objectName) throws Exception {
        return minioClient.statObject(
                StatObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .build());
    }

    public String generateSongFileName(Long songId, String originalFilename) {
        return String.format("song_%d_%d.%s",
                songId,
                System.currentTimeMillis(),
                getExtension(originalFilename));
    }

    public String generateCoverFileName(Long releaseId, String originalFilename) {
        return String.format("cover_release_%d_%d.%s",
                releaseId,
                System.currentTimeMillis(),
                getExtension(originalFilename));
    }

    public String getExtension(String filename) {
        if (filename == null || filename.isEmpty())
            return "bin";
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1).toLowerCase();
    }
}
