import { memo } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser, useAuth } from '@clerk/clerk-react';

export const Navbar = memo(function Navbar() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
          <header className="sticky top-0 z-40 border-b bg-[#F5F3F0]/95 backdrop-blur-sm border-gray-200">
      <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A00000] to-[#CC5500] flex items-center justify-center">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[#262930] font-bold text-lg">XONED</h1>
            <p className="text-[#404040] text-xs">Admin Dashboard</p>
          </div>
        </div>

        {/* Spacer to push user menu to the right */}
        <div className="flex-1"></div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 sm:h-10 rounded-full px-1 sm:px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'Admin'} />
                    <AvatarFallback>{user?.firstName?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm text-[#262930]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-[#404040]">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p>{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-[#404040]">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  <p className="text-xs text-green-600 font-medium">Admin</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-[#A00000]">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
});
