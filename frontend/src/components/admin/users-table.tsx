// src/components/admin/users-table.tsx
"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash, Download, UserPlus, Eye } from "lucide-react";
import { useUsers, useDeleteUser } from "@/hooks/use-user-hooks";
import { EditUserDialog } from "./edit-user-dialog";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserDialog } from "./create-user-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Link } from "@tanstack/react-router";

// Define types based on your API documentation
export type UserType = "ARTIST" | "LABEL" | "MODERATOR" | "ADMIN" | "PLATFORM";

export interface User {
  id: number;
  login: string;
  type: UserType;
  registrationDate: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

interface UsersTableProps {
  pageSize?: number;
  initialFilters?: {
    type?: UserType;
  };
}

export function UsersTable({ pageSize = 10, initialFilters = {} }: UsersTableProps) {
  const [page, setPage] = React.useState(0); // zero-based
  const [filters, setFilters] = React.useState(initialFilters);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = React.useState(false);
  const [downloadSettings, setDownloadSettings] = React.useState({
    page: 0,
    size: 1000,
    fileType: "json",
    embed: "none",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const { data, isLoading, isError, error } = useUsers(page, pageSize, filters.type);
  const deleteMutation = useDeleteUser();

  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const handleDialogClose = () => {
    setEditingUser(null);
    setUserToDelete(null);
    setIsCreateDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    deleteMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null);
        toast.success(`User ${userToDelete.login} deleted successfully`);
      },
      onError: (error: AxiosError<{ error: string; message: string }>) => {
        const errorMessage = error.response?.data?.message || "Failed to delete user";
        toast.error(errorMessage);
      }
    });
  };

  const handleDownloadSettingsChange = (field: string, value: string | number) => {
    setDownloadSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterChange = (type: UserType | undefined) => {
    setFilters({ type });
    setPage(0); // Reset to first page when filter changes
  };

  const handleDownload = () => {
    // TODO: Implement download functionality based on your API
    toast.info("Download functionality will be implemented");
  };

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Error loading users: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions and filters */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.type || "all"}
            onValueChange={(value) => handleFilterChange(value === "all" ? undefined : value as UserType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ARTIST">Artists</SelectItem>
              <SelectItem value="LABEL">Labels</SelectItem>
              <SelectItem value="MODERATOR">Moderators</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
              <SelectItem value="PLATFORM">Platforms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Users</DialogTitle>
                <div className="mt-1 text-muted-foreground text-sm">
                  Configure your export settings below
                </div>
              </DialogHeader>
              <div className="gap-4 grid py-4">
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="page" className="text-right">
                    Page
                  </Label>
                  <Input
                    id="page"
                    type="number"
                    min="0"
                    value={downloadSettings.page}
                    onChange={(e) => handleDownloadSettingsChange("page", parseInt(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="size" className="text-right">
                    Page Size
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    min="1"
                    max="1000"
                    value={downloadSettings.size}
                    onChange={(e) => handleDownloadSettingsChange("size", parseInt(e.target.value) || 1)}
                    className="col-span-3"
                  />
                </div>
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="fileType" className="text-right">
                    File Type
                  </Label>
                  <Select
                    value={downloadSettings.fileType}
                    onValueChange={(value) => handleDownloadSettingsChange("fileType", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Exporting
                    </>
                  ) : (
                    "Download"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-6 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-16 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-32 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                </TableRow>
              ))
              : data?.content.length ? (
                data.content.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.id}</TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.type === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                        user.type === 'MODERATOR' ? 'bg-purple-100 text-purple-800' :
                          user.type === 'ARTIST' ? 'bg-green-100 text-green-800' :
                            user.type === 'LABEL' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {user.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to="/admin/users/$userId" params={{ userId: user.id.toString() }}>
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="sr-only">View {user.login}</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(user)}
                          className="w-8 h-8"
                          disabled={user.type === 'PLATFORM'} // Example: disable editing for platform users
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit {user.login}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user)}
                          className="hover:bg-destructive/10 w-8 h-8 text-destructive hover:text-destructive"
                          disabled={user.type === 'ADMIN' || user.type === 'PLATFORM'} // Prevent deleting admins/platforms
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
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


      {/* Total count footer */}
      <div className="text-muted-foreground text-sm text-center">
        {data ? (
          <>
            Showing{" "}
            <strong>
              {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, data.totalElements)}
            </strong>{" "}
            of <strong>{data.totalElements}</strong> users
          </>
        ) : isLoading ? (
          "Loading..."
        ) : null}
      </div>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          toast.success("User created successfully");
        }}
      />

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={handleDialogClose}
          onSuccess={() => {
            setEditingUser(null);
            toast.success(`User ${editingUser.login} updated successfully`);
          }}
        />
      )}

      <ConfirmDeleteDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Confirm User Deletion"
        description={
          userToDelete ? (
            <>
              Are you sure you want to delete user{" "}
              <span className="font-medium">{userToDelete.login}</span> of type{" "}
              <span className="font-medium">{userToDelete.type}</span>?
              <br />
              <span className="block mt-2 font-medium text-destructive">
                This action cannot be undone and will permanently remove this user.
              </span>
            </>
          ) : null
        }
        confirmText="Delete User"
        destructive
      />
    </div>
  );
}
