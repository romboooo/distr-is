import { queryClient } from '@/providers/query-client';
import { RouterProviderWrapper } from '@/providers/router-provider-wrapper';
import { ThemeProvider } from '@/providers/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider defaultTheme='dark'>
      <QueryClientProvider client={queryClient}>
        {children}
        <RouterProviderWrapper />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
