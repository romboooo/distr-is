// src/routes/unauthorized.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import z from 'zod';

const unauthorizedSearchSchema = z.object({
  attempted: z.string().optional(),
});

export const Route = createFileRoute('/unauthorized')({
  validateSearch: (search) => unauthorizedSearchSchema.parse(search),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const handleGoHome = () => {
    navigate({ to: '/dashboard' });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate({ to: '/login' });
  };

  return (
    <div className='mx-auto mt-16 p-6 max-w-md text-center'>
      <div className='mb-4 text-6xl'>🚫</div>
      <h1 className='mb-2 font-bold text-2xl'>Access Denied</h1>
      <p className='mb-6 text-gray-600'>
        You don't have permission to access this page.
        {search.attempted && (
          <span className='block mt-2'>
            Attempted to access: {search.attempted}
          </span>
        )}
      </p>

      <div className='flex justify-center space-x-4'>
        <Button onClick={handleGoHome} variant='default'>
          Go to Dashboard
        </Button>
        <Button onClick={handleLogout} variant='secondary'>
          Logout
        </Button>
      </div>
    </div>
  );
}
