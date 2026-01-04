// src/components/layouts/user-layout.tsx
import { UserHeader } from '@/components/navigation/user-header';
import { Outlet } from '@tanstack/react-router';

export const UserLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <UserHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
