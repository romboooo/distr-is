// src/components/admin/edit-user-dialog.tsx
"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle } from "lucide-react";
import { useUpdateUser, useCurrentUser } from "@/hooks/use-user-hooks";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User, UserType } from "@/types/api";

const editUserSchema = z.object({
  login: z.string().min(3, "Login must be at least 3 characters").max(50, "Login must be at most 50 characters"),
  type: z.enum(["ARTIST", "LABEL", "MODERATOR", "ADMIN", "PLATFORM"]),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const updateMutation = useUpdateUser();
  const currentUser = useCurrentUser();
  const [error, setError] = React.useState<string | null>(null);
  const [showTypeWarning, setShowTypeWarning] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<UserType>(user.type);

  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      login: user.login,
      type: user.type,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        login: user.login,
        type: user.type,
      });
      setSelectedType(user.type);
      setError(null);
      setShowTypeWarning(false);
    }
  }, [open, user, reset]);

  React.useEffect(() => {
    if (open) {
      const currentType = getValues("type");
      if (currentType !== selectedType) {
        setSelectedType(currentType);
      }
    }
  }, [open, getValues, selectedType]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      if ((data.type === "ADMIN" || data.type === "PLATFORM") && data.type !== user.type) {
        if (currentUser.data?.type !== "ADMIN") {
          toast.error("Only ADMIN users can promote users to ADMIN or PLATFORM roles");
          return;
        }
        setShowTypeWarning(true);
        return;
      }

      await updateMutation.mutateAsync({
        id: user.id,
        login: data.login,
        type: data.type,
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Failed to update user. Please try again.");
    }
  };

  const handleTypeChange = (value: string) => {
    const userType = value as UserType;
    setSelectedType(userType);
    setValue("type", userType);
    setError(null);
    setShowTypeWarning(false);

    if ((userType === "ADMIN" || userType === "PLATFORM") && userType !== user.type) {
      if (currentUser.data?.type !== "ADMIN") {
        toast.error("Only ADMIN users can promote users to ADMIN or PLATFORM roles");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.login}</DialogTitle>
          <div className="mt-1 text-muted-foreground text-sm">
            Update user details. Note: Changing user type may require admin privileges.
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="gap-4 grid py-4">
          <div className="items-center gap-4 grid grid-cols-4">
            <Label htmlFor="login" className="text-right">
              Login
            </Label>
            <Input
              id="login"
              className="col-span-3"
              {...register("login")}
              disabled={updateMutation.isPending}
            />
            {errors.login && (
              <p className="col-span-3 col-start-2 mt-1 text-destructive text-sm">
                {errors.login.message}
              </p>
            )}
          </div>

          <div className="items-center gap-4 grid grid-cols-4">
            <Label htmlFor="type" className="text-right">
              User Type
            </Label>
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
              disabled={updateMutation.isPending}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARTIST">Artist</SelectItem>
                <SelectItem value="LABEL">Label</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="PLATFORM">Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showTypeWarning && (
            <div className="col-span-full bg-yellow-50 p-3 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 w-4 h-4 text-yellow-500" />
                <p className="text-yellow-700 text-sm">
                  <strong>Warning:</strong> You are about to change this user's type to {selectedType}.
                  This action requires admin privileges and cannot be undone. Are you sure you want to proceed?
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="col-span-full text-destructive text-sm text-center">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
            className={showTypeWarning ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : showTypeWarning ? (
              "Confirm Type Change"
            ) : (
              "Update User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
