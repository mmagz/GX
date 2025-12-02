import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  category: string;
  addedAt?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'id' | 'addedAt'>, quantity?: number, showToast?: boolean) => Promise<boolean>;
  removeItem: (cartItemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  itemCount: number;
  subtotal: number;
  loading: boolean;
  syncCart: () => Promise<void>;
  // Optimistic updates
  optimisticAddItem: (item: Omit<CartItem, 'quantity' | 'id' | 'addedAt'>, quantity?: number) => void;
  optimisticRemoveItem: (cartItemId: string) => void;
  optimisticUpdateQuantity: (cartItemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn, userId } = useAuth();
  const { login } = useAuthContext();
  
  // Performance optimizations
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const pendingOperations = useRef<Set<string>>(new Set());

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (isSignedIn && userId) {
      syncCart();
    } else if (!isSignedIn) {
      // Clear cart when user logs out
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
  const optimisticAddItem = useCallback((newItem: Omit<CartItem, 'quantity' | 'id' | 'addedAt'>, quantity: number = 1) => {
    setItems(prev => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(item => 
        item.productId === newItem.productId && 
        item.size === newItem.size && 
        item.color === newItem.color
      );

      if (existingItemIndex !== -1) {
        // Check if adding this quantity would exceed the limit
        const newQuantity = prev[existingItemIndex].quantity + quantity;
        if (newQuantity > 6) {
          toast.error('Maximum quantity reached', {
            description: 'You can only add up to 6 of the same product to your cart.'
          });
          return prev; // Don't update if it would exceed limit
        }
        
        // Update existing item quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        
        // Show feedback for quantity update
        toast.success('Updated cart ✅', {
          description: `${newItem.name} quantity increased to ${newQuantity}`
        });
        
        return updatedItems;
      } else {
        // Check quantity limit for new items
        if (quantity > 6) {
          toast.error('Maximum quantity exceeded', {
            description: 'You can only add up to 6 of the same product to your cart.'
          });
          return prev; // Don't add if it exceeds limit
        }
        
        // Add new item
        const tempId = `temp_${Date.now()}_${Math.random()}`;
        const optimisticItem: CartItem = {
          ...newItem,
          id: tempId,
          quantity: quantity,
        };
        
        // Show feedback for new item
        const quantityText = quantity > 1 ? ` (${quantity}x)` : '';
        toast.success('Added to cart ✅', {
          description: `${newItem.name}${quantityText} added successfully`
        });
        
        return [...prev, optimisticItem];
      }
    });
  }, []);

  const optimisticRemoveItem = useCallback((cartItemId: string) => {
    const item = items.find(item => item.id === cartItemId);
    if (item) {
      setItems(prev => prev.filter(item => item.id !== cartItemId));
      toast.info('Removed from cart', {
        description: `${item.name} has been removed`
      });
    }
  }, [items]);

  const optimisticUpdateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === cartItemId 
        ? { ...item, quantity: Math.max(0, Math.min(6, quantity)) } // Enforce max 6 items
        : item
    ).filter(item => item.quantity > 0));
  }, []);

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

  const syncCart = async () => {
    if (!isSignedIn || !userId) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';
      
      const response = await fetch(`${base}/api/cart/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cartItems) {
          setItems(data.cartItems);
        }
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: Omit<CartItem, 'quantity' | 'id' | 'addedAt'>, quantity: number = 1, showToast: boolean = false): Promise<boolean> => {
    if (!isSignedIn) {
      toast.error('Please log in to add items to your cart', {
        description: 'You need to be signed in to add items to your cart.',
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

    // Check if item already exists in cart
    const existingItem = items.find(item => 
      item.productId === newItem.productId && 
      item.size === newItem.size && 
      item.color === newItem.color
    );

    if (existingItem) {
      // Check if adding this quantity would exceed the limit
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 6) {
        toast.error('Maximum quantity reached', {
          description: 'You can only add up to 6 of the same product to your cart.'
        });
        return false;
      }
      // If item exists, just update the quantity
      return await updateQuantity(existingItem.id, newQuantity);
    }

    // Check quantity limit for new items
    if (quantity > 6) {
      toast.error('Maximum quantity exceeded', {
        description: 'You can only add up to 6 of the same product to your cart.'
      });
      return false;
    }

    // Only show optimistic update if not already shown
    if (showToast) {
      optimisticAddItem(newItem, quantity);
    } else {
      // Just update the UI without toast
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const optimisticItem: CartItem = {
        ...newItem,
        id: tempId,
        quantity: quantity,
      };
      setItems(prev => [...prev, optimisticItem]);
    }

    // Debounced backend sync
    const operationId = `add_${newItem.productId}_${newItem.size}_${newItem.color}`;
    
    // Prevent duplicate operations
    if (pendingOperations.current.has(operationId)) {
      return true; // Operation already in progress
    }
    
    pendingOperations.current.add(operationId);

    debouncedApiCall(operationId, async () => {
      try {
        const token = await getToken();
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

        // Add single item with quantity to backend
        const response = await fetch(`${base}/api/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              itemId: newItem.productId,
              size: newItem.size,
              color: newItem.color || 'DEFAULT',
              quantity: quantity, // Send quantity in the request
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to add to cart');
          }

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || 'Failed to add to cart');
          }

          // Sync with backend to get real data
          await syncCart();
      } catch (error) {
        console.error('Add to cart error:', error);
        // Rollback optimistic update on error
        setItems(prev => prev.filter(item => !item.id.startsWith('temp_')));
        toast.error('Failed to add to cart', {
          description: 'Please try again'
        });
      }
    }, 100);

    return true;
  };

  const removeItem = async (cartItemId: string): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please log in to manage your cart', {
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
    optimisticRemoveItem(cartItemId);

    // Debounced backend sync
    const operationId = `remove_${cartItemId}`;
    pendingOperations.current.add(operationId);

    debouncedApiCall(operationId, async () => {
      try {
        const token = await getToken();
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

        // Find the cart item to get its details
        const cartItem = items.find(item => item.id === cartItemId);
        if (!cartItem) {
          throw new Error('Cart item not found');
        }

        const response = await fetch(`${base}/api/cart/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            itemId: cartItem.productId,
            size: cartItem.size,
            color: cartItem.color,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await syncCart();
          } else {
            throw new Error(data.message || 'Failed to remove from cart');
          }
        } else {
          throw new Error('Failed to remove from cart');
        }
      } catch (error) {
        console.error('Remove from cart error:', error);
        // Rollback optimistic update on error
        await syncCart();
        toast.error('Failed to remove item', {
          description: 'Please try again'
        });
      }
    }, 200);

    return true;
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please log in to update your cart', {
        action: {
          label: 'Login',
          onClick: () => {
            login();
          }
        }
      });
      return false;
    }

    if (quantity <= 0) {
      return await removeItem(cartItemId);
    }

    // Check maximum quantity limit
    if (quantity > 6) {
      toast.error('Maximum quantity reached', {
        description: 'You can only add up to 6 of the same product to your cart.'
      });
      return false;
    }

    // Optimistic update - show immediate feedback
    optimisticUpdateQuantity(cartItemId, quantity);

    // Debounced backend sync
    const operationId = `update_${cartItemId}`;
    pendingOperations.current.add(operationId);

    debouncedApiCall(operationId, async () => {
      try {
        const token = await getToken();
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

        // Find the cart item to get its details
        const cartItem = items.find(item => item.id === cartItemId);
        if (!cartItem) {
          throw new Error('Cart item not found');
        }

        const response = await fetch(`${base}/api/cart/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            itemId: cartItem.productId,
            size: cartItem.size,
            quantity,
            color: cartItem.color,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await syncCart();
          } else {
            throw new Error(data.message || 'Failed to update quantity');
          }
        } else {
          throw new Error('Failed to update quantity');
        }
      } catch (error) {
        console.error('Update quantity error:', error);
        // Rollback optimistic update on error
        await syncCart();
        toast.error('Failed to update quantity', {
          description: 'Please try again'
        });
      }
    }, 500); // Longer delay for quantity updates to handle rapid changes

    return true;
  };

  const clearCart = async (): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please log in to clear your cart', {
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

      const response = await fetch(`${base}/api/cart/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
    setItems([]);
    toast.info('Cart cleared');
          return true;
        }
      }
      
      throw new Error('Failed to clear cart');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        loading,
        syncCart,
        optimisticAddItem,
        optimisticRemoveItem,
        optimisticUpdateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}