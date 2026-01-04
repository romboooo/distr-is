// src/components/navigation/user-header.tsx
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className='bg-background border-b'>
      <div className='flex justify-between items-center mx-auto px-4 py-4 container'>
        <Link to='/' className='font-bold text-2xl'>
          Music Platform
        </Link>
        <nav className='flex items-center space-x-6'>
          <Link to='/releases' className='hover:text-primary'>
            Releases
          </Link>
          <Link to='/royalties' className='hover:text-primary'>
            Royalties
          </Link>
          <Link to='/profile' className='hover:text-primary'>
            Profile
          </Link>
          <div className='flex items-center space-x-2'>
            <span className='text-sm'>Welcome, {user?.login}</span>
            <Button variant='outline' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
