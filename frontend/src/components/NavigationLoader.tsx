import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  navigateWithLoading: (url: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const navigateWithLoading = (url: string) => {
    setIsLoading(true);
    // Use hash-based navigation for hash URLs
    if (url.startsWith('#')) {
      // Small delay to show loading, then navigate
      setTimeout(() => {
        window.location.hash = url;
        // Clear loading after navigation completes
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }, 300);
    } else {
      // Full page navigation
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    }
  };

  // Clear loading state on hash changes and ensure it's cleared on mount
  useEffect(() => {
    // Always clear loading on mount - pages should handle their own loading states
    setIsLoading(false);

    const handleHashChange = () => {
      setIsLoading(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Safety timeout - clear loading after 2 seconds max
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isLoading, setLoading, navigateWithLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#262930]" style={{ fontSize: '16px' }}>
              Loading...
            </p>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
