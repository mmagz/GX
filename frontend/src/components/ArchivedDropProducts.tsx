import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Lock } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { fetchAPI } from '../utils/api';

interface ArchivedDropProductsProps {
  dropCode: number;
}

export function ArchivedDropProducts({ dropCode }: ArchivedDropProductsProps) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getToken().catch(() => undefined);
        const data = await fetchAPI(`/api/product/drop/${dropCode}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch products for drop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dropCode, getToken]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 h-96 rounded-sm"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <div key={product._id} className="relative group">
          <ProductCard {...product} />
          {/* Sold Out Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm pointer-events-none">
            <div className="text-center">
              <Lock size={32} className="mx-auto mb-2 text-white" />
              <p 
                className="uppercase-headline text-white"
                style={{ fontSize: '12px', letterSpacing: '0.15em' }}
              >
                SOLD OUT
              </p>
              <p className="text-white/70 mt-1" style={{ fontSize: '10px' }}>
                No longer available
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
