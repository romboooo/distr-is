// src/components/navigation/admin-header.tsx
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export const AdminHeader = () => {
  const { data, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };
  console.log(data);
  return (
    <header className='bg-background border-b'>
      <div className='flex justify-between items-center mx-auto px-4 py-4 container'>
        <Link to='/admin' className='font-bold text-2xl'>
          Admin Panel
        </Link>
        <nav className='flex items-center space-x-6'>
          <Link to='/admin/users' className='hover:text-primary'>
            Users
          </Link>
          <Link to='/admin/platforms' className='hover:text-primary'>
            Platforms
          </Link>
          <Link to='/admin/reports' className='hover:text-primary'>
            Reports
          </Link>
          <div className='flex items-center space-x-2'>
            <span className='text-sm'>Admin: {data?.login}</span>
            <Button variant='outline' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
