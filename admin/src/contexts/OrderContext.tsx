import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminOrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
}

const AdminOrderContext = createContext<AdminOrderContextType | undefined>(undefined);

export function AdminOrderProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

  // Get auth headers
  const getAuthHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, [getToken]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${base}/api/order/list`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to fetch orders');
        toast.error('Failed to fetch orders', { description: data.message });
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Network error');
      toast.error('Network error', { description: 'Could not fetch orders.' });
    } finally {
      setLoading(false);
    }
  }, [base, getAuthHeaders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${base}/api/order/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId, status }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success('Order status updated successfully');
        return true;
      } else {
        toast.error('Failed to update order status', { description: data.message });
        return false;
      }
    } catch (err: any) {
      console.error('Update order status error:', err);
      toast.error('Network error', { description: 'Could not update order status.' });
      return false;
    }
  }, [base, getAuthHeaders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <AdminOrderContext.Provider value={{
      orders,
      loading,
      error,
      fetchOrders,
      updateOrderStatus
    }}>
      {children}
    </AdminOrderContext.Provider>
  );
}

export function useAdminOrders() {
  const context = useContext(AdminOrderContext);
  if (context === undefined) {
    throw new Error('useAdminOrders must be used within an AdminOrderProvider');
  }
  return context;
}

