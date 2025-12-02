import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from './AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (productId: string, productData?: Partial<WishlistItem>) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<boolean>;
  itemCount: number;
  loading: boolean;
  syncWishlist: () => Promise<void>;
  // Optimistic updates
  optimisticAddToWishlist: (productId: string, productData?: Partial<WishlistItem>) => void;
  optimisticRemoveFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn, userId } = useAuth();
  const { login } = useAuthContext();
  
  // Performance optimizations
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const pendingOperations = useRef<Set<string>>(new Set());

  // Sync wishlist with backend when user logs in
  useEffect(() => {
    if (isSignedIn && userId) {
      syncWishlist();
    } else if (!isSignedIn) {
      // Clear wishlist when user logs out
      setItems([]);
    }
  }, [isSignedIn, userId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Optimistic update functions for instant UI feedback
  const optimisticAddToWishlist = useCallback((productId: string, productData?: Partial<WishlistItem>) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const optimisticItem: WishlistItem = {
      id: tempId,
      productId: productId,
      name: productData?.name || 'Product',
      price: productData?.price || 0,
      image: productData?.image || 'https://via.placeholder.com/300x300?text=Loading...',
      category: productData?.category || 'GENERAL',
      addedAt: new Date().toISOString(),
    };
    
    setItems(prev => [...prev, optimisticItem]);
    
    // Show immediate feedback
    toast.success('Added to wishlist ❤️', {
      description: `${optimisticItem.name} saved for later`
    });
  }, []);

  const optimisticRemoveFromWishlist = useCallback((productId: string) => {
    const item = items.find(item => item.productId === productId);
    if (item) {
      setItems(prev => prev.filter(item => item.productId !== productId));
      toast.info('Removed from wishlist', {
        description: `${item.name} removed from saved items`
      });
    }
  }, [items]);

  // Debounced API call function
  const debouncedApiCall = useCallback((operation: string, apiCall: () => Promise<void>, delay: number = 300) => {
    // Clear existing timeout for this operation
    if (debounceTimeouts.current[operation]) {
      clearTimeout(debounceTimeouts.current[operation]);
    }
    
    // Set new timeout
    debounceTimeouts.current[operation] = setTimeout(async () => {
      try {
        await apiCall();
        pendingOperations.current.delete(operation);
      } catch (error) {
        console.error(`Debounced ${operation} failed:`, error);
        pendingOperations.current.delete(operation);
      }
    }, delay);
  }, []);

  const syncWishlist = async () => {
    if (!isSignedIn || !userId) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/wishlist/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setItems(data.wishlistItems || []);
        }
      }
    } catch (error) {
      console.error('Sync wishlist error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string, productData?: Partial<WishlistItem>): Promise<boolean> => {
    if (!isSignedIn) {
      toast.error('Please sign in to save items to your wishlist', {
        action: {
          label: 'Login',
          onClick: () => {
            login();
          }
        }
      });
      return false;
    }

    if (!userId) return false;

    // Check if already in wishlist
    if (isInWishlist(productId)) {
      toast.info('Item already in wishlist');
      return false;
    }

    // Optimistic update - show immediate feedback with product data
    optimisticAddToWishlist(productId, productData);

    // Debounced backend sync
    const operationId = `add_wishlist_${productId}`;
    pendingOperations.current.add(operationId);

    debouncedApiCall(operationId, async () => {
      try {
        const token = await getToken();
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

        const response = await fetch(`${base}/api/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await syncWishlist();
          } else {
            throw new Error(data.message || 'Failed to add to wishlist');
          }
        } else {
          throw new Error('Failed to add to wishlist');
        }
      } catch (error) {
        console.error('Add to wishlist error:', error);
        // Rollback optimistic update on error
        setItems(prev => prev.filter(item => !item.id.startsWith('temp_')));
        toast.error('Failed to add to wishlist', {
          description: 'Please try again'
        });
      }
    }, 100);

    return true;
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please sign in to manage your wishlist', {
        action: {
          label: 'Login',
          onClick: () => {
            login();
          }
        }
      });
      return false;
    }

    // Optimistic update - show immediate feedback
    optimisticRemoveFromWishlist(productId);

    // Debounced backend sync
    const operationId = `remove_wishlist_${productId}`;
    pendingOperations.current.add(operationId);

    debouncedApiCall(operationId, async () => {
      try {
        const token = await getToken();
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

        const response = await fetch(`${base}/api/wishlist/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await syncWishlist();
          } else {
            throw new Error(data.message || 'Failed to remove from wishlist');
          }
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } catch (error) {
        console.error('Remove from wishlist error:', error);
        // Rollback optimistic update on error
        await syncWishlist();
        toast.error('Failed to remove from wishlist', {
          description: 'Please try again'
        });
      }
    }, 200);

    return true;
  };

  const clearWishlist = async (): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please sign in to clear your wishlist', {
        action: {
          label: 'Login',
          onClick: () => {
            login();
          }
        }
      });
      return false;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/wishlist/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setItems([]);
          toast.success('Wishlist cleared', {
            description: 'All items removed from wishlist'
          });
          return true;
        }
      }
      
      throw new Error('Failed to clear wishlist');
    } catch (error) {
      console.error('Clear wishlist error:', error);
      toast.error('Failed to clear wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
      addToWishlist, 
      removeFromWishlist, 
        isInWishlist,
        clearWishlist,
        itemCount,
        loading,
        syncWishlist,
        optimisticAddToWishlist,
        optimisticRemoveFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}