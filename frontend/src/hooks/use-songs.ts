import { queryClient } from '@/providers/query-client';
import { apiClient } from '@/services/api';
import { uploadSongFile } from '@/services/songs';
import type { AxiosErrorResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadSongFile = () => {
  return useMutation<
    { path: string },
    AxiosErrorResponse,
    { songId: number; file: File }
  >({
    mutationFn: ({ songId, file }) => uploadSongFile(songId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['song', variables.songId] });
    },
  });
};

const downloadSongFile = async (songId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Unauthorized: No authentication token found');
    }

    const response = await apiClient.get(`/songs/${songId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important for binary data
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = `song_${songId}.mp3`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'audio/mpeg',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Song download failed:', error);
    throw error;
  }
};

export const useDownloadSong = () => {
  return useMutation<void, AxiosErrorResponse, number>({
    mutationFn: downloadSongFile,
    onSuccess: () => {
      toast.success('Song downloaded successfully!', {
        duration: 3000,
      });
    },
    onError: (error: AxiosErrorResponse) => {
      let errorMessage = 'Failed to download song';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to download this song';
            break;
          case 404:
            errorMessage = 'Song file not found';
            break;
          case 500:
            errorMessage = 'Server error while processing download';
            break;
        }
      }

      toast.error(errorMessage, {
        duration: 5000,
      });

      throw error;
    },
  });
};
