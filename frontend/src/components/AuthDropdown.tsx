import { User, LogOut, Package, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from './AuthContext';

export function AuthDropdown() {
  const { user, isAuthenticated, login, logout, signup } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      window.location.hash = '#account';
    }
  };

  const handleOrdersClick = () => {
    if (isAuthenticated) {
      window.location.hash = '#account';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="transition-smooth hover:text-[#D04007]">
            <User size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-[#f9f7f0] border-[#262930]/10 mt-2"
          sideOffset={8}
        >
          {!isAuthenticated ? (
            <>
              <DropdownMenuItem 
                onClick={login}
                className="cursor-pointer hover:bg-[#262930]/5 focus:bg-[#262930]/5"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <User size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Sign In
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#262930]/10" />
              <DropdownMenuItem 
                onClick={signup}
                className="cursor-pointer hover:bg-[#262930]/5 focus:bg-[#262930]/5"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <Package size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Sign Up
                  </span>
                </div>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <div className="px-2 py-3 border-b border-[#262930]/10">
                <p className="uppercase-headline mb-1" style={{ fontSize: '10px' }}>
                  Welcome Back
                </p>
                <p style={{ fontSize: '12px', fontWeight: 500 }}>
                  {user?.name}
                </p>
                <p className="text-[#404040]" style={{ fontSize: '10px' }}>
                  {user?.email}
                </p>
              </div>
              <DropdownMenuItem 
                onClick={handleAccountClick}
                className="cursor-pointer hover:bg-[#262930]/5 focus:bg-[#262930]/5"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <User size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Dashboard
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleOrdersClick}
                className="cursor-pointer hover:bg-[#262930]/5 focus:bg-[#262930]/5"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <Package size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Orders
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-[#262930]/5 focus:bg-[#262930]/5"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <Settings size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Settings
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#262930]/10" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-[#D04007]/10 focus:bg-[#D04007]/10 text-[#D04007]"
              >
                <div className="flex items-center gap-3 w-full py-2">
                  <LogOut size={16} />
                  <span className="uppercase-headline" style={{ fontSize: '11px' }}>
                    Logout
                  </span>
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
