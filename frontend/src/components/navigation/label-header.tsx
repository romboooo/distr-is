import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { LogOut, Music, DollarSign } from 'lucide-react';

export const LabelHeader = () => {
  const { data, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b'>
      <div className='flex justify-between items-center px-6 w-full h-16'>
        <Link to='/' className='font-bold text-2xl'>
          Music Platform
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                to='/label/releases'
                className={navigationMenuTriggerStyle()}
              >
                <Music className='mr-2 w-4 h-4' /> Releases
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to='/label/royalties'
                className={navigationMenuTriggerStyle()}
              >
                <DollarSign className='mr-2 w-4 h-4' /> Royalties
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className='flex items-center gap-4'>
          <div className='font-medium text-sm'>Welcome, {data?.login}</div>
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
