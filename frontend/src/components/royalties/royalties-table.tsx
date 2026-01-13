// src/components/releases/royalties-table.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { useGetReleaseRoyalties } from '@/hooks/use-release-hooks';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationControls } from '@/components/ui/pagination-controls';

export interface Royalty {
  royaltyId: number;
  amount: number;
  songId: number;
  songTitle: string;
  platformId: number;
  platformName: string;
}

interface RoyaltiesTableProps {
  releaseId: number;
  pageSize?: number;
}

export function RoyaltiesTable({
  releaseId,
  pageSize = 10,
}: RoyaltiesTableProps) {
  const [page, setPage] = React.useState(0);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = React.useState(false);
  const [downloadSettings, setDownloadSettings] = React.useState({
    page: 0,
    size: 1000,
    fileType: 'json',
  });

  const { data, isLoading, isError, error } = useGetReleaseRoyalties(
    releaseId,
    page,
    pageSize,
  );

  const handleDownloadSettingsChange = (
    field: string,
    value: string | number,
  ) => {
    setDownloadSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = () => {
    // TODO: Implement actual download functionality
    toast.info('Download functionality will be implemented');
    setIsDownloadDialogOpen(false);
  };

  if (isError) {
    return (
      <div className='p-4 text-destructive'>
        Error loading royalties: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header with actions */}
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold text-lg'>Royalties</h2>

        <Dialog
          open={isDownloadDialogOpen}
          onOpenChange={setIsDownloadDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant='outline' className='gap-2'>
              <Download className='w-4 h-4' />
              Export Data
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Export Royalties</DialogTitle>
              <div className='mt-1 text-muted-foreground text-sm'>
                Configure your export settings below
              </div>
            </DialogHeader>
            <div className='gap-4 grid py-4'>
              <div className='items-center gap-4 grid grid-cols-4'>
                <Label htmlFor='page' className='text-right'>
                  Page
                </Label>
                <Input
                  id='page'
                  type='number'
                  min='0'
                  value={downloadSettings.page}
                  onChange={(e) =>
                    handleDownloadSettingsChange(
                      'page',
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='items-center gap-4 grid grid-cols-4'>
                <Label htmlFor='size' className='text-right'>
                  Page Size
                </Label>
                <Input
                  id='size'
                  type='number'
                  min='1'
                  max='1000'
                  value={downloadSettings.size}
                  onChange={(e) =>
                    handleDownloadSettingsChange(
                      'size',
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className='col-span-3'
                />
              </div>
              <div className='items-center gap-4 grid grid-cols-4'>
                <Label htmlFor='fileType' className='text-right'>
                  File Type
                </Label>
                <Select
                  value={downloadSettings.fileType}
                  onValueChange={(value) =>
                    handleDownloadSettingsChange('fileType', value)
                  }
                >
                  <SelectTrigger className='col-span-3'>
                    <SelectValue placeholder='Select file type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='json'>JSON</SelectItem>
                    <SelectItem value='csv'>CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type='submit'
                onClick={handleDownload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                    Exporting
                  </>
                ) : (
                  'Download'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Song</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className='w-6 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-32 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-24 h-4' />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Skeleton className='ml-auto w-16 h-4' />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.content.length ? (
              data.content.map((royalty) => (
                <TableRow key={royalty.royaltyId}>
                  <TableCell className='font-mono'>{royalty.royaltyId}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{royalty.songTitle}</div>
                      <div className='text-muted-foreground text-sm'>
                        ID: {royalty.songId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{royalty.platformName}</div>
                      <div className='text-muted-foreground text-sm'>
                        ID: {royalty.platformId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='font-medium text-right'>
                    ${royalty.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  {isLoading ? 'Loading royalties...' : 'No royalties found for this release.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Total count footer */}
      <div className='text-muted-foreground text-sm text-center'>
        {data ? (
          <>
            Showing{' '}
            <strong>
              {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, data.totalElements)}
            </strong>{' '}
            of <strong>{data.totalElements}</strong> royalty records
          </>
        ) : isLoading ? (
          'Loading...'
        ) : null}
      </div>
    </div>
  );
}
