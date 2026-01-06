// src/components/admin/create-user-dialog.tsx
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
import { Loader2 } from "lucide-react";
import { useCreateUser } from "@/hooks/use-user-hooks";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserType } from "@/types/api";

const createUserSchema = z.object({
  login: z.string().min(3, "Login must be at least 3 characters").max(50, "Login must be at most 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(["ARTIST", "LABEL", "MODERATOR", "ADMIN", "PLATFORM"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserDialog({ open, onOpenChange, onSuccess }: CreateUserDialogProps) {
  const createMutation = useCreateUser();
  const [error, setError] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<UserType>("ARTIST");

  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      login: "",
      password: "",
      type: "ARTIST",
    },
  });

  React.useEffect(() => {
    if (!open) {
      reset();
      setError(null);
      setSelectedType("ARTIST");
    }
  }, [open, reset]);

  React.useEffect(() => {
    // Sync the local state with form values when dialog opens
    if (open) {
      const currentType = getValues("type");
      setSelectedType(currentType);
    }
  }, [open, getValues]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Failed to create user. Please try again.");
    }
  };

  const handleTypeChange = (value: string) => {
    const userType = value as UserType;
    setSelectedType(userType);
    setValue("type", userType);
    setError(null);

    // Handle type-specific validation rules
    if (value === "ADMIN" || value === "PLATFORM") {
      toast.warning("Only ADMIN users can create ADMIN or PLATFORM accounts");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <div className="mt-1 text-muted-foreground text-sm">
            Create a new user account with the specified credentials and type
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
              disabled={createMutation.isPending}
            />
            {errors.login && (
              <p className="col-span-3 col-start-2 mt-1 text-destructive text-sm">
                {errors.login.message}
              </p>
            )}
          </div>

          <div className="items-center gap-4 grid grid-cols-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              {...register("password")}
              disabled={createMutation.isPending}
            />
            {errors.password && (
              <p className="col-span-3 col-start-2 mt-1 text-destructive text-sm">
                {errors.password.message}
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
              disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
