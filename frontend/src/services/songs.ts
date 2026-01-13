import { apiClient } from '@/services/api';

export async function uploadSongFile(
  songId: number,
  file: File,
): Promise<{ path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ path: string }>(
    `/songs/${songId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}
