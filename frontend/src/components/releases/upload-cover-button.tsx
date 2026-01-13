import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUploadReleaseCover } from '@/hooks/use-release-hooks';
import { Upload, X } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function UploadCoverButton({ releaseId }: { releaseId: number }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadCover, isPending: isUploading } =
    useUploadReleaseCover();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, GIF, WEBP)');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError('File size must be less than 5MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFileSelect(selectedFile);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [handleFileSelect],
  );

  const handleRemoveFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!file) return;

    uploadCover(
      { releaseId, file },
      {
        onSuccess: () => {
          toast.success('Success', {
            description: 'Cover image uploaded successfully',
          });
          setOpen(false);
        },
        onError: (error) => {
          setError(
            error.response?.data?.message || 'Failed to upload cover image',
          );
          toast.error('Upload failed', {
            description:
              error.response?.data?.message || 'Please try again later',
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setOpen(true)}
          aria-label='Upload cover image'
        >
          <Upload className='w-4 h-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogTitle>Upload Cover Image</DialogTitle>

        <div className='py-4'>
          {preview ? (
            <div className='space-y-4'>
              <div className='group relative'>
                <img
                  src={preview}
                  alt='Cover preview'
                  className='bg-muted border rounded-lg w-full h-64 object-contain'
                />
                <Button
                  size='icon'
                  variant='secondary'
                  className='-top-2 -right-2 absolute opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={handleRemoveFile}
                  aria-label='Remove image'
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>

              <div className='text-center'>
                <p className='font-medium'>{file?.name}</p>
                <p className='text-muted-foreground text-sm'>
                  {(file?.size || 0) / 1024 < 1024
                    ? `${(file?.size || 0) / 1024} KB`
                    : `${((file?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                </p>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileInputChange}
              />

              <div className='flex flex-col justify-center items-center gap-3'>
                <div className='bg-muted p-3 rounded-full'>
                  <Upload className='w-6 h-6 text-muted-foreground' />
                </div>
                <div>
                  <p className='font-medium'>Drag & drop your cover image</p>
                  <p className='mt-1 text-muted-foreground text-sm'>
                    or click to browse files
                  </p>
                  <p className='mt-2 text-muted-foreground text-xs'>
                    JPG, PNG, GIF, WEBP • Max 5MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className='mt-2 text-red-500 text-sm text-center'>{error}</p>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          {preview && (
            <Button onClick={handleSubmit} disabled={isUploading || !file}>
              {isUploading ? 'Uploading...' : 'Upload Cover'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
