// src/components/layouts/user-layout.tsx
import { ArtistHeader } from '@/components/navigation/artist-header';
import { Outlet } from '@tanstack/react-router';

export const ModeratorLayout = () => {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <ArtistHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
