import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { LogOut, Users, BarChart3, Database } from 'lucide-react';

export const AdminHeader = () => {
  const { data: user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b w-full'>
      <div className='flex justify-between items-center px-6 w-full h-16'>
        <Link to='/admin' className='font-bold text-2xl'>
          Admin Panel
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to='/admin/users' className={navigationMenuTriggerStyle()}>
                <Users className='mr-2 w-4 h-4' /> Users
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to='/admin/platforms'
                className={navigationMenuTriggerStyle()}
              >
                <Database className='mr-2 w-4 h-4' /> Platforms
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to='/admin/reports'
                className={navigationMenuTriggerStyle()}
              >
                <BarChart3 className='mr-2 w-4 h-4' /> Reports
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className='flex items-center gap-4'>
          <div className='font-medium text-sm'>Admin: {user?.login}</div>
          <Button
            variant='outline'
            onClick={handleLogout}
            className='flex items-center gap-2'
          >
            <LogOut className='w-4 h-4' /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
