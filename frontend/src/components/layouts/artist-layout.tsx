// src/components/layouts/artist-layout.tsx
import { ArtistHeader } from '@/components/navigation/artist-header';
import { Outlet } from '@tanstack/react-router';

export const ArtistLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <ArtistHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
