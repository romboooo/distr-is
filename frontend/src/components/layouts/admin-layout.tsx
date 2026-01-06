// src/components/layouts/admin-layout.tsx
import { AdminHeader } from '@/components/navigation/admin-header';
import { Outlet } from '@tanstack/react-router';

export const AdminLayout = () => {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <AdminHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
