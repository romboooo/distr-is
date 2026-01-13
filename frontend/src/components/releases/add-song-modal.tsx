import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAddSongToRelease } from '@/hooks/use-release-hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileAudio, AlertCircle } from 'lucide-react';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/auth';
import { useUploadSongFile } from '@/hooks/use-songs';

const songSchema = z.object({
  title: z.string().min(1, 'Song title is required'),
  musicAuthor: z.string().min(1, 'Music author is required'),
  parentalAdvisory: z.boolean(),
  metadata: z.string().optional(),
});

type SongFormData = z.infer<typeof songSchema>;

interface AddSongModalProps {
  releaseId: number;
  artistId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddSongModal({
  releaseId,
  artistId,
  open,
  onOpenChange,
  onSuccess,
}: AddSongModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSongMutation = useAddSongToRelease(releaseId);
  const uploadFileMutation = useUploadSongFile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      parentalAdvisory: false,
      metadata: '',
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedFile(null);
      setFileError(null);
      setIsUploading(false);
      setIsDragging(false);
    }
  }, [open, reset]);

  // Handle file validation - allow any audio file
  const validateFile = useCallback((file: File): string | null => {
    // Check if it's an audio file using the MIME type
    if (!file.type.startsWith('audio/')) {
      return 'Please upload an audio file';
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return 'File size exceeds 50 MB limit';
    }

    return null;
  }, []);

  // Handle file selection (from input or drop)
  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        setSelectedFile(null);
        return;
      }

      setFileError(null);
      setSelectedFile(file);
    },
    [validateFile],
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        // Get the first audio file from the dropped files
        const audioFiles = Array.from(files).filter((file) =>
          file.type.startsWith('audio/'),
        );
        if (audioFiles.length > 0) {
          handleFileSelect(audioFiles[0]);
        } else {
          setFileError('No audio files found in the dropped items');
        }
      }
    },
    [handleFileSelect],
  );

  // Trigger file input click
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (formData: SongFormData) => {
    // Validate file selection
    if (!selectedFile) {
      setFileError('Please select an audio file');
      return;
    }

    try {
      setIsUploading(true);

      // Create song stub first
      const newSong = await addSongMutation.mutateAsync({
        releaseId: releaseId,
        title: formData.title,
        artistIds: [artistId],
        musicAuthor: formData.musicAuthor,
        parentalAdvisory: formData.parentalAdvisory,
        metaData: formData.metadata || '{}',
      });

      // Upload audio file
      await uploadFileMutation.mutateAsync({
        songId: newSong.id,
        file: selectedFile,
      });

      // Success handling
      toast.success('Song added successfully', {
        description: `${formData.title} has been added to your release`,
      });

      // Close modal and trigger success callback
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : (error as AxiosError<ErrorResponse>)?.response?.data?.message ||
          'An error occurred while adding the song';

      toast.error('Failed to add song', {
        description: errMsg,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size to human readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get audio format from file type or name
  const getAudioFormat = (file: File): string => {
    const type = file.type;
    if (type === 'audio/mpeg') return 'MP3';
    if (type === 'audio/wav') return 'WAV';
    if (type === 'audio/ogg') return 'OGG';
    if (type === 'audio/flac') return 'FLAC';
    if (type === 'audio/aac') return 'AAC';

    // Fallback to extension if MIME type is not specific enough
    const extension = file.name.split('.').pop()?.toUpperCase() || 'Audio';
    return extension;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Song Title</Label>
            <Input
              id='title'
              placeholder='Enter song title'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-destructive text-sm'>{errors.title.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='musicAuthor'>Music Author</Label>
            <Input
              id='musicAuthor'
              placeholder='Enter music author name'
              {...register('musicAuthor')}
            />
            {errors.musicAuthor && (
              <p className='text-destructive text-sm'>
                {errors.musicAuthor.message}
              </p>
            )}
          </div>

          <div className='flex items-start space-x-2'>
            <Checkbox id='parentalAdvisory' {...register('parentalAdvisory')} />
            <div className='gap-1.5 grid leading-none'>
              <Label htmlFor='parentalAdvisory'>Parental Advisory</Label>
              <p className='text-muted-foreground text-sm'>
                Contains explicit content
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='metadata'>Additional Metadata (JSON)</Label>
            <Textarea
              id='metadata'
              placeholder='{ "bpm": 120, "key": "C Major" }'
              {...register('metadata')}
              className='font-mono'
            />
            <p className='text-muted-foreground text-xs'>
              Optional metadata in valid JSON format
            </p>
            {errors.metadata?.message && (
              <p className='text-destructive text-sm'>
                {errors.metadata.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='audioFile'>Audio File</Label>
            <div
              className={cn(
                'relative flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-lg w-full transition-colors cursor-pointer',
                isDragging
                  ? 'border-primary bg-primary/10 animate-pulse'
                  : selectedFile
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50',
                fileError && 'border-destructive/50 bg-destructive/5',
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDropZoneClick}
            >
              <input
                ref={fileInputRef}
                id='audioFile'
                type='file'
                accept='audio/*'
                className='hidden'
                onChange={handleFileChange}
              />

              <div className='flex flex-col items-center px-2 max-w-full text-center'>
                {selectedFile ? (
                  <>
                    <FileAudio className='mb-2 w-12 h-12 text-primary' />
                    <p className='max-w-xs font-medium text-primary truncate'>
                      {selectedFile.name}
                    </p>
                    <div className='flex flex-col items-center mt-1'>
                      <span className='font-medium text-primary text-sm'>
                        {getAudioFormat(selectedFile)}
                      </span>
                      <span className='text-muted-foreground text-sm'>
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className='mb-2 w-12 h-12 text-muted-foreground' />
                    <p className='max-w-[250px] font-medium text-center'>
                      {isDragging
                        ? 'Drop your audio file here'
                        : 'Drag & drop or click to upload audio file'}
                    </p>
                    <p className='mt-1 text-muted-foreground text-sm'>
                      <span className='font-semibold text-primary'>
                        Any audio format
                      </span>{' '}
                      • Max 50 MB
                    </p>
                    {isDragging && (
                      <p className='mt-1 text-primary text-xs animate-pulse'>
                        Release to upload
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Visual indicator for drag area */}
              {isDragging && (
                <div className='absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg animate-pulse pointer-events-none' />
              )}
            </div>

            {fileError && (
              <div className='flex items-start gap-1.5 text-destructive text-sm'>
                <AlertCircle className='mt-0.5 w-4 h-4 shrink-0' />
                <span>{fileError}</span>
              </div>
            )}

            {!selectedFile && !fileError && (
              <div className='space-y-1 text-muted-foreground text-xs text-center'>
                <p>Supports drag & drop • Click to browse files</p>
                <p>Accepted formats: MP3, WAV, OGG, FLAC, AAC, and more</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              disabled={
                isUploading ||
                addSongMutation.isPending ||
                uploadFileMutation.isPending ||
                !selectedFile
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                'Add Song'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
