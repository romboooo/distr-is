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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Eye,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { Release } from '@/types/api';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { usePendingReleases } from '@/hooks/use-moderation-release-hooks';
import { ModerationDialog } from '@/components/moderation/moderation-dialog';

export interface PendingReleasesTableProps {
  pageSize?: number;
}

export function PendingReleasesTable({
  pageSize = 10,
}: PendingReleasesTableProps) {
  const [page, setPage] = React.useState(0);
  const [selectedRelease, setSelectedRelease] = React.useState<Release | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = usePendingReleases(page, pageSize);

  const handleModerateClick = (release: Release) => {
    setSelectedRelease(release);
  };

  const handleCloseDialog = () => {
    setSelectedRelease(null);
  };

  if (isError) {
    return (
      <div className='p-4 text-destructive'>
        Error loading releases: {(error as Error).message}
      </div>
    );
  }

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'ALBUM':
        return 'bg-blue-100 text-blue-800';
      case 'SINGLE':
        return 'bg-green-100 text-green-800';
      case 'EP':
        return 'bg-purple-100 text-purple-800';
      case 'MAXI_SINGLE':
        return 'bg-amber-100 text-amber-800';
      case 'MIXTAPE':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className='space-y-6'>
      <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4'>
        <h1 className='font-bold text-2xl'>Pending Releases</h1>
        <Button
          variant='outline'
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
          ) : (
            <RefreshCw className='mr-2 w-4 h-4' />
          )}
          Refresh
        </Button>
      </div>

      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead>ID</TableHead>
              <TableHead>Release Name</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className='w-[120px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className='w-8 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-32 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-24 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-20 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-16 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-32 h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='w-24 h-4' />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.content.length ? (
              data.content.map((release) => (
                <TableRow
                  key={release.id}
                  className='hover:bg-muted/50 transition-colors'
                >
                  <TableCell className='font-mono font-medium'>
                    {release.id}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {release.name || 'Untitled Release'}
                  </TableCell>
                  <TableCell>{release.artistId || 'Unknown Artist'}</TableCell>
                  <TableCell>{release.genre || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className={cn(
                        'px-2 py-1 rounded-md font-medium text-xs',
                        getReleaseTypeColor(release.releaseType),
                      )}
                    >
                      {release.releaseType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(release.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        asChild
                        className='w-8 h-8'
                      >
                        <Link
                          to='/moderation/$releaseId'
                          params={{ releaseId: release.id.toString() }}
                        >
                          <Eye className='w-4 h-4 text-blue-500' />
                          <span className='sr-only'>
                            View {release.name} details
                          </span>
                        </Link>
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleModerateClick(release)}
                        className='w-8 h-8'
                      >
                        <CheckCircle className='w-4 h-4 text-green-500' />
                        <span className='sr-only'>
                          Moderate {release.name}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='h-32 text-muted-foreground text-center'
                >
                  {isLoading ? 'Loading releases...' : 'No pending releases found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <div className='text-muted-foreground text-sm text-center'>
        {data ? (
          <>
            Showing{' '}
            <strong>
              {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, data.totalElements)}
            </strong>{' '}
            of <strong>{data.totalElements}</strong> pending releases
          </>
        ) : isLoading ? (
          'Loading...'
        ) : null}
      </div>

      <ModerationDialog
        release={selectedRelease}
        open={!!selectedRelease}
        onOpenChange={(open) => !open && handleCloseDialog()}
        onSuccess={handleCloseDialog}
      />
    </div>
  );
}
