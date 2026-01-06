// src/routes/_admin/admin/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash, Pencil, ArrowLeft } from 'lucide-react';
import {
  useUserWithDetails,
  useDeleteUser,
  useUpdateUser,
} from '@/hooks/use-user-detail-hooks';
import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { UserType } from '@/types/api';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { EditUserDialog } from '@/components/admin/edit-user-dialog';

export const Route = createFileRoute('/_admin/admin/users/$userId')({
  component: UserDetailPage,
  loader: async ({ params: { userId } }) => {
    const id = parseInt(userId);
    if (isNaN(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }

    return { userId: id };
  },
});

function UserDetailPage() {
  const { userId } = Route.useLoaderData();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserWithDetails(userId);
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center mx-auto py-8 container'>
        <Loader2 className='w-8 h-8 text-muted-foreground animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-auto py-8 container'>
        <Card>
          <CardContent className='p-6 text-destructive'>
            Error loading user: {(error as Error).message}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='mx-auto py-8 container'>
        <Card>
          <CardContent className='p-6 text-muted-foreground text-center'>
            User not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        toast.success(`User ${user.login} deleted successfully`);
        setIsDeleteDialogOpen(false); // Close dialog after success
      },
      onError: (error: AxiosError<{ error: string; message: string }>) => {
        const errorMessage =
          error.response?.data?.message || 'Failed to delete user';
        toast.error(errorMessage);
      },
    });
  };

  const getBadgeColor = (type: UserType) => {
    switch (type) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'MODERATOR':
        return 'bg-purple-100 text-purple-800';
      case 'ARTIST':
        return 'bg-green-100 text-green-800';
      case 'LABEL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PLATFORM':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='mx-auto py-6 container'>
      <div className='flex items-center gap-4 mb-6'>
        <Link
          to='/admin/users'
          className='text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <h1 className='font-bold text-2xl'>User Details</h1>
      </div>

      <div className='gap-6 grid'>
        {/* User Card */}
        <Card>
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className='text-2xl'>{user.login}</CardTitle>
                <CardDescription>User ID: {user.id}</CardDescription>
              </div>
              <Badge className={getBadgeColor(user.type)}>{user.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='gap-6 grid md:grid-cols-2'>
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-1 font-medium'>Basic Information</h3>
                  <div className='space-y-2 text-muted-foreground'>
                    <div className='flex justify-between'>
                      <span>Registration Date:</span>
                      <span>{formatDate(user.registrationDate)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>User Type:</span>
                      <span className='font-medium'>{user.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='mb-1 font-medium'>Account Status</h3>
                  <div className='space-y-2 text-muted-foreground'>
                    <div className='flex justify-between'>
                      <span>Status:</span>
                      <span className='font-medium text-green-600'>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Type-specific details */}
              <div className='space-y-4'>
                {user.type === 'ARTIST' && user.artistDetails && (
                  <div>
                    <h3 className='mb-1 font-medium'>Artist Information</h3>
                    <div className='space-y-2 text-muted-foreground'>
                      <div className='flex justify-between'>
                        <span>Artist Name:</span>
                        <span className='font-medium'>
                          {user.artistDetails.name}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Real Name:</span>
                        <span>{user.artistDetails.realName}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Country:</span>
                        <span>{user.artistDetails.country}</span>
                      </div>
                    </div>
                  </div>
                )}

                {user.type === 'LABEL' && user.labelDetails && (
                  <div>
                    <h3 className='mb-1 font-medium'>Label Information</h3>
                    <div className='space-y-2 text-muted-foreground'>
                      <div className='flex justify-between'>
                        <span>Contact Name:</span>
                        <span className='font-medium'>
                          {user.labelDetails.contactName}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Country:</span>
                        <span>{user.labelDetails.country}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Phone:</span>
                        <span>{user.labelDetails.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {user.type === 'MODERATOR' && (
                  <div>
                    <h3 className='mb-1 font-medium'>Moderator Information</h3>
                    <div className='text-muted-foreground'>
                      This user has moderator privileges and can review releases
                      and content.
                    </div>
                  </div>
                )}

                {user.type === 'ADMIN' && (
                  <div>
                    <h3 className='mb-1 font-medium'>Admin Information</h3>
                    <div className='text-muted-foreground'>
                      This user has full administrative privileges over the
                      entire system.
                    </div>
                  </div>
                )}

                {user.type === 'PLATFORM' && (
                  <div>
                    <h3 className='mb-1 font-medium'>Platform Information</h3>
                    <div className='text-muted-foreground'>
                      This user represents a distribution platform in the
                      system.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {user.type !== 'ADMIN' && user.type !== 'PLATFORM' && (
          <div className='flex justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(true)}
              disabled={updateMutation.isPending}
            >
              <Pencil className='mr-2 w-4 h-4' />
              Edit User
            </Button>
            <Button
              variant='destructive'
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteMutation.isPending}
            >
              <Trash className='mr-2 w-4 h-4' />
              Delete User
            </Button>
          </div>
        )}

        {/* Edit User Dialog */}
        <EditUserDialog
          user={user}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            refetch();
            toast.success(`User ${user.login} updated successfully`);
          }}
        />

        {/* Replaced with ConfirmDeleteDialog */}
        <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          title='Confirm User Deletion'
          description={
            <>
              Are you sure you want to delete user{' '}
              <span className='font-medium'>{user.login}</span> of type{' '}
              <span className='font-medium'>{user.type}</span>?
              <br />
              <span className='block mt-2 font-medium text-destructive'>
                This action cannot be undone and will permanently remove this
                user and all associated data.
              </span>
            </>
          }
          confirmText={deleteMutation.isPending ? 'Deleting' : 'Delete User'}
          cancelText='Cancel'
        />
      </div>
    </div>
  );
}
