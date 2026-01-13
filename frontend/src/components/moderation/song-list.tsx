'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Music, Download } from 'lucide-react'; // Added Download icon
import { useGetReleaseSongs } from '@/hooks/use-release-hooks';
import { formatDuration } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Added Button import
import { useState } from 'react'; // Added useState
import { useDownloadSong } from '@/hooks/use-songs';

interface SongListProps {
  releaseId: number;
}

export function SongList({ releaseId }: SongListProps) {
  const {
    data: songs,
    isLoading,
    isError,
    error,
  } = useGetReleaseSongs(releaseId);

  // Added download functionality
  const { mutateAsync: downloadSong } = useDownloadSong();
  const [downloadingSongId, setDownloadingSongId] = useState<number | null>(
    null,
  );

  const handleDownload = async (songId: number) => {
    setDownloadingSongId(songId);
    try {
      await downloadSong(songId);
    } finally {
      setDownloadingSongId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <Loader2 className='w-8 h-8 text-muted-foreground animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-destructive/10 p-4 border border-destructive/20 rounded-md'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='mt-0.5 w-5 h-5 text-destructive shrink-0' />
          <div>
            <p className='font-medium text-destructive'>Error loading songs</p>
            <p className='text-muted-foreground text-sm'>
              {(error as Error)?.message || 'Failed to fetch song information'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center bg-muted py-12 border border-dashed rounded-lg'>
        <Music className='mb-4 w-12 h-12 text-muted-foreground' />
        <p className='mb-1 font-medium text-muted-foreground text-lg'>
          No songs found
        </p>
        <p className='max-w-md text-muted-foreground text-sm text-center'>
          This release doesn't have any songs associated with it yet.
        </p>
      </div>
    );
  }

  return (
    <Card className='border'>
      <CardHeader>
        <CardTitle className='font-semibold text-lg'>
          Tracks ({songs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='border rounded-md overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead className='w-[40px]'>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist(s)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>UPC</TableHead>
                <TableHead>Parental Advisory</TableHead>
                <TableHead className='w-[60px] text-center'>
                  Actions
                </TableHead>{' '}
                {/* Added Actions column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song, index) => (
                <TableRow
                  key={song.id}
                  className='hover:bg-muted/30 transition-colors'
                >
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      <p className='font-medium'>
                        {song.title || 'Untitled Track'}
                      </p>
                      {song.musicAuthor && (
                        <p className='text-muted-foreground text-sm'>
                          Author: {song.musicAuthor}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {song.artistNames?.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {song.artistNames.map((artistName, i) => (
                          <Badge
                            key={i}
                            variant='secondary'
                            className='bg-blue-50 text-blue-700'
                          >
                            {artistName}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className='text-muted-foreground'>
                        Unknown Artist
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {song.songLengthSeconds
                      ? formatDuration(song.songLengthSeconds)
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='font-mono'>
                    {song.songUpc || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    {song.parentalAdvisory ? (
                      <Badge variant='destructive'>Explicit</Badge>
                    ) : (
                      <Badge variant='outline'>Clean</Badge>
                    )}
                  </TableCell>
                  {/* Added Download button cell */}
                  <TableCell className='text-center'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDownload(song.id)}
                      disabled={downloadingSongId === song.id}
                      className='w-8 h-8'
                    >
                      {downloadingSongId === song.id ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : (
                        <Download className='w-4 h-4' />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
