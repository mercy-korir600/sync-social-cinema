
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Video } from 'lucide-react';

const Header = ({ user, onLogout, currentRoom }) => {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">WatchTogether</h1>
          </div>
          
          {currentRoom && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                In Room
              </Badge>
              <span className="text-white font-medium">{currentRoom.name}</span>
            </div>
          )}
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-purple-400/30">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-xl border-purple-500/20" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{user.username}</p>
                  {user.email && (
                    <p className="text-xs text-gray-400">{user.email}</p>
                  )}
                  {user.isAnonymous && (
                    <Badge variant="secondary" className="w-fit text-xs">Guest</Badge>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="border-white/10" />
              <DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-white/10" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
