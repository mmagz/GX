import { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { CartSidebar } from './CartSidebar';
import { WishlistDropdown } from './WishlistDropdown';
import { AuthDropdown } from './AuthDropdown';
import { useCart } from './CartContext';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from './AuthContext';
import logoImage from 'figma:asset/63e4e15218776129690de7149a14041fbae47d13.png';

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { isSignedIn, signOut } = useAuth();
  const { login } = useAuthContext();

  return (
    <>
      <nav className="fixed top-8 left-0 right-0 z-50 frosted-glass border-b border-white/30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between h-14">
            {/* Left Navigation */}
            <div className="flex items-center gap-8 flex-1">
              <a 
                href="#capsule" 
                className="uppercase-headline transition-smooth hover:text-[#D04007] relative group"
                style={{ fontSize: '11px' }}
              >
                CAPSULE
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D04007] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#vault" 
                className="uppercase-headline transition-smooth hover:text-[#D04007] relative group"
                style={{ fontSize: '11px' }}
              >
                VAULT
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D04007] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Center Logo */}
            <a href="#" className="flex items-center justify-center flex-shrink-0">
              <img 
                src={logoImage} 
                alt="XONED" 
                className="h-8 w-auto transition-smooth hover:opacity-80"
              />
            </a>

            {/* Right Navigation */}
            <div className="flex items-center justify-end gap-6 flex-1">
              <a href="#search" className="transition-smooth hover:text-[#D04007]">
                <Search size={18} />
              </a>
              <a href="#about" className="uppercase-headline transition-smooth hover:text-[#D04007] relative group" style={{ fontSize: '11px' }}>
                ABOUT
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D04007] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <AuthDropdown />
              <WishlistDropdown />
              <button 
                onClick={() => setIsCartOpen(true)}
                className="transition-smooth hover:text-[#D04007] relative"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D04007] text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: '9px' }}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between h-12">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="transition-smooth hover:text-[#D04007]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <a href="#" className="flex items-center">
              <img 
                src={logoImage} 
                alt="XONED" 
                className="h-6 w-auto transition-smooth hover:opacity-80"
              />
            </a>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="transition-smooth hover:text-[#D04007] relative"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D04007] text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: '9px' }}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden fixed top-20 left-0 right-0 frosted-glass border-b border-white/30 z-[45] transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ boxShadow: '0 4px 20px rgba(204, 85, 0, 0.1)' }}
      >
        <div className="px-4 py-6 space-y-4">
          <a 
            href="#capsule" 
            className="block uppercase-headline transition-smooth hover:text-[#D04007] py-2"
            style={{ fontSize: '12px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CAPSULE
          </a>
          <a 
            href="#vault" 
            className="block uppercase-headline transition-smooth hover:text-[#D04007] py-2"
            style={{ fontSize: '12px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            VAULT
          </a>
          <a 
            href="#about" 
            className="block uppercase-headline transition-smooth hover:text-[#D04007] py-2"
            style={{ fontSize: '12px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ABOUT
          </a>
          <a 
            href="#search" 
            className="block uppercase-headline transition-smooth hover:text-[#D04007] py-2"
            style={{ fontSize: '12px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SEARCH
          </a>
          <div className="pt-2">
            <WishlistDropdown itemCount={3} />
          </div>
          
          {/* Mobile Authentication Section */}
          <div className="pt-4 border-t border-white/20">
            {isSignedIn ? (
              <div className="space-y-3">
                <a 
                  href="#account" 
                  className="flex items-center gap-3 uppercase-headline transition-smooth hover:text-[#D04007] py-2"
                  style={{ fontSize: '12px' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={16} />
                  MY ACCOUNT
                </a>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 uppercase-headline transition-smooth hover:text-[#D04007] py-2 w-full text-left"
                  style={{ fontSize: '12px' }}
                >
                  <LogOut size={16} />
                  SIGN OUT
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    login();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 uppercase-headline transition-smooth hover:text-[#D04007] py-2 w-full text-left"
                  style={{ fontSize: '12px' }}
                >
                  <User size={16} />
                  SIGN IN
                </button>
                <button 
                  onClick={() => {
                    login();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 uppercase-headline transition-smooth hover:text-[#D04007] py-2 w-full text-left"
                  style={{ fontSize: '12px' }}
                >
                  <User size={16} />
                  SIGN UP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}