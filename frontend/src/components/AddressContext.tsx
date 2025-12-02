import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from './AuthContext';
import { toast } from 'sonner';

interface Address {
  _id: string;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: Omit<Address, '_id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateAddress: (addressId: string, addressData: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
}

const AddressContext = createContext(undefined);

export function AddressProvider({ children }: { children: any }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isSignedIn, userId, getToken } = useAuth();
  const { login } = useAuthContext();

  const fetchAddresses = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/address/get`, {
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
          setAddresses(data.addresses || []);
        } else {
          throw new Error(data.message || 'Failed to fetch addresses');
        }
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
      toast.error('Failed to load addresses', {
        description: 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, userId, getToken]);

  const addAddress = useCallback(async (addressData: Omit<Address, '_id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!isSignedIn) {
      toast.error('Please log in to manage addresses', {
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

    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/address/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          ...addressData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Address added successfully');
          await fetchAddresses(); // Refresh addresses
          return true;
        } else {
          throw new Error(data.message || 'Failed to add address');
        }
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      console.error('Add address error:', error);
      toast.error('Failed to add address', {
        description: 'Please try again'
      });
      return false;
    }
  }, [isSignedIn, userId, getToken, login, fetchAddresses]);

  const updateAddress = useCallback(async (addressId: string, addressData: Partial<Address>): Promise<boolean> => {
    if (!isSignedIn) {
      toast.error('Please log in to manage addresses');
      return false;
    }

    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/address/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId,
          ...addressData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Address updated successfully');
          await fetchAddresses(); // Refresh addresses
          return true;
        } else {
          throw new Error(data.message || 'Failed to update address');
        }
      } else {
        throw new Error('Failed to update address');
      }
    } catch (error) {
      console.error('Update address error:', error);
      toast.error('Failed to update address', {
        description: 'Please try again'
      });
      return false;
    }
  }, [isSignedIn, getToken, fetchAddresses]);

  const deleteAddress = useCallback(async (addressId: string): Promise<boolean> => {
    if (!isSignedIn) {
      toast.error('Please log in to manage addresses');
      return false;
    }

    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/address/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Address deleted successfully');
          await fetchAddresses(); // Refresh addresses
          return true;
        } else {
          throw new Error(data.message || 'Failed to delete address');
        }
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Delete address error:', error);
      toast.error('Failed to delete address', {
        description: 'Please try again'
      });
      return false;
    }
  }, [isSignedIn, getToken, fetchAddresses]);

  const setDefaultAddress = useCallback(async (addressId: string): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      toast.error('Please log in to manage addresses');
      return false;
    }

    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/address/set-default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Default address updated');
          await fetchAddresses(); // Refresh addresses
          return true;
        } else {
          throw new Error(data.message || 'Failed to set default address');
        }
      } else {
        throw new Error('Failed to set default address');
      }
    } catch (error) {
      console.error('Set default address error:', error);
      toast.error('Failed to set default address', {
        description: 'Please try again'
      });
      return false;
    }
  }, [isSignedIn, userId, getToken, fetchAddresses]);

  // Fetch addresses when user logs in
  useEffect(() => {
    if (isSignedIn && userId) {
      fetchAddresses();
    } else {
      setAddresses([]);
    }
  }, [isSignedIn, userId, fetchAddresses]);

  const value: AddressContextType = {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
