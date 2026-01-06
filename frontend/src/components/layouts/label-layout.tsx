// src/components/layouts/label-layout.tsx
import { LabelHeader } from '@/components/navigation/label-header';
import { Outlet } from '@tanstack/react-router';

export const LabelLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <LabelHeader />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
