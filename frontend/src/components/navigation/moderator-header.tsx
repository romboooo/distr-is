import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { LogOut, Shield, FileText } from 'lucide-react';

export const ModeratorHeader = () => {
  const { data, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center px-6 w-full h-16">
        <Link to="/moderation" className="font-bold text-2xl">
          <Shield className="inline-block mr-2 w-5 h-5" /> Moderation Panel
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/moderation" className={navigationMenuTriggerStyle()}>
                <FileText className="mr-2 w-4 h-4" /> Pending Releases
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <div className="font-medium text-sm">
            Moderator: {data?.login}
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
