// src/routes/_admin/admin/users/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { UsersTable } from '@/components/admin/users-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_admin/admin/users/')({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="mx-auto py-6 container">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-bold text-2xl">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
