import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  category: string;
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
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getOrderStatus: (status: string) => { label: string; color: string; progressColor: string; step: number };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { userId, getToken, isSignedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

  const fetchOrders = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch(`${base}/api/order/userorders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
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
  }, [userId, getToken, isSignedIn, base]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getOrderStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; progressColor: string; step: number }> = {
      'Order Placed': { label: 'Order Placed', color: 'bg-green-100 text-green-700', progressColor: 'bg-green-500', step: 1 },
      'Confirmed': { label: 'Confirmed', color: 'bg-yellow-100 text-yellow-700', progressColor: 'bg-yellow-500', step: 2 },
      'Processing': { label: 'Processing', color: 'bg-orange-100 text-orange-700', progressColor: 'bg-orange-500', step: 1 },
      'Shipped': { label: 'Shipped', color: 'bg-gray-100 text-black', progressColor: 'bg-gray-600', step: 3 },
      'Delivered': { label: 'Delivered', color: 'bg-green-100 text-green-700', progressColor: 'bg-green-500', step: 4 },
      'Cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700', progressColor: 'bg-red-500', step: 0 }
    };
    
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', progressColor: 'bg-gray-500', step: 0 };
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      error,
      fetchOrders,
      getOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

