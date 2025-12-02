import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';

// Types
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Capsule {
  _id: string;
  name: string;
  description: string;
  bannerUrl: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: any[];
  orderItems: any[];
  total: number;
  status: string;
  address: any;
  createdAt: string;
  updatedAt: string;
}

interface AdminContextType {
  products: Product[];
  capsules: Capsule[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCapsules: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<boolean>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  addCapsule: (capsuleData: Partial<Capsule>) => Promise<boolean>;
  updateCapsule: (capsuleId: string, capsuleData: Partial<Capsule>) => Promise<boolean>;
  deleteCapsule: (capsuleId: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
}

const AdminContext = createContext(undefined);

const API_BASE_URL = `${(import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com'}/api`;

export function AdminProvider({ children }: { children: any }) {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth headers
  const getAuthHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, [getToken]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/product/list`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch capsules
  const fetchCapsules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/drop/all`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch capsules: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCapsules(data.drops || []);
      } else {
        throw new Error(data.message || 'Failed to fetch capsules');
      }
    } catch (error) {
      console.error('Error fetching capsules:', error);
      setError(error.message);
      toast.error('Failed to fetch capsules');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/order/list`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Add product
  const addProduct = useCallback(async (productData: Partial<Product>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/product/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        toast.success('Product added successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      return false;
    }
  }, [getAuthHeaders, fetchProducts]);

  // Update product
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/product/update/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        toast.success('Product updated successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return false;
    }
  }, [getAuthHeaders, fetchProducts]);

  // Delete product
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/product/delete/${productId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        toast.success('Product deleted successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
  }, [getAuthHeaders, fetchProducts]);

  // Add capsule
  const addCapsule = useCallback(async (capsuleData: Partial<Capsule>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/drop/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(capsuleData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add capsule: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchCapsules();
        toast.success('Capsule added successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to add capsule');
      }
    } catch (error) {
      console.error('Error adding capsule:', error);
      toast.error('Failed to add capsule');
      return false;
    }
  }, [getAuthHeaders, fetchCapsules]);

  // Update capsule
  const updateCapsule = useCallback(async (capsuleId: string, capsuleData: Partial<Capsule>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/drop/update/${capsuleId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: capsuleData.name,
          description: capsuleData.description,
          bannerUrl: capsuleData.bannerUrl,
          date: capsuleData.date,
          status: capsuleData.status
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update capsule: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchCapsules();
        toast.success('Capsule updated successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to update capsule');
      }
    } catch (error) {
      console.error('Error updating capsule:', error);
      toast.error('Failed to update capsule');
      return false;
    }
  }, [getAuthHeaders, fetchCapsules]);

  // Delete capsule
  const deleteCapsule = useCallback(async (capsuleId: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/drop/delete/${capsuleId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete capsule: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchCapsules();
        toast.success('Capsule deleted successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete capsule');
      }
    } catch (error) {
      console.error('Error deleting capsule:', error);
      toast.error('Failed to delete capsule');
      return false;
    }
  }, [getAuthHeaders, fetchCapsules]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/order/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchOrders();
        return true;
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      return false;
    }
  }, [getAuthHeaders, fetchOrders]);

  // Load data on mount
  useEffect(() => {
    fetchProducts();
    fetchCapsules();
    fetchOrders();
  }, [fetchProducts, fetchCapsules, fetchOrders]);

  const value = {
    products,
    capsules,
    orders,
    loading,
    error,
    fetchProducts,
    fetchCapsules,
    fetchOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    addCapsule,
    updateCapsule,
    deleteCapsule,
    updateOrderStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}