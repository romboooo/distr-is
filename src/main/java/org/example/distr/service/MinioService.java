package org.example.distr.service;

import io.minio.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;

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

  public String uploadFile(String bucket, String objectName, MultipartFile file) throws Exception {
    try {
      minioClient.putObject(
          PutObjectArgs.builder()
              .bucket(bucket)
              .object(objectName)
              .stream(file.getInputStream(), file.getSize(), -1)
              .contentType(file.getContentType())
              .build());
      return String.format("%s/%s", bucket, objectName);
    } catch (Exception e) {
      log.error("Error uploading file to MinIO: {}", e.getMessage());
      throw new RuntimeException("Failed to upload file", e);
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
