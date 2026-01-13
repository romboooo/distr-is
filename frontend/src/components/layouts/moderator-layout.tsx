// src/components/layouts/moderator-layout.tsx
import { ModeratorHeader } from '@/components/navigation/moderator-header';
import { Outlet } from '@tanstack/react-router';

export const ModeratorLayout = () => {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <ModeratorHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
