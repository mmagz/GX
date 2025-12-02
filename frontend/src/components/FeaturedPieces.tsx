import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchAPI } from '../utils/api';

export function FeaturedPieces() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken().catch(() => undefined)
        const data = await fetchAPI('/api/product/current-drop', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        
        // Add console.log to debug
        console.log('Current drop products fetched:', data.products)
        
        setItems(data.products || [])
      } catch (error) {
        console.error('Failed to fetch current drop products:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [getToken])
  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <p 
          className="uppercase-headline text-[#D04007] mb-2"
          style={{ fontSize: '10px', letterSpacing: '0.3em' }}
        >
          CURRENT DROP
        </p>
        <h2 
          className="uppercase-headline"
          style={{ 
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 600,
            letterSpacing: '0.1em'
          }}
        >
          FEATURED PIECES
        </h2>
        <p 
          className="mt-4 max-w-2xl mx-auto"
          style={{ fontSize: '12px', opacity: 0.8 }}
        >
          Curated selection from our latest collection. Limited quantities available.
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="sm" text="LOADING FEATURED PIECES" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ fontSize: '14px', opacity: 0.6 }}>
            No products available at the moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.slice(0, 4).map((p) => {
            // Use actual product images only
            const variantImg = p?.variants?.[0]?.images?.[0] || ''
            const productImg = Array.isArray(p?.image) && p.image.length > 0 ? p.image[0] : ''
            const img = productImg || variantImg
            
            console.log('Product:', p.name, 'Image:', img) // Debug log
            
            return (
              <ProductCard 
                key={p._id}
                id={p._id} 
                name={p.name} 
                price={p.price} 
                image={img} 
                category={p.category} 
                colors={p.variants?.map((v: any) => v.colorHex)} 
                slug={p.slug} 
              />
            )
          })}
        </div>
      )}

      {/* View Capsule Button */}
      <div className="flex justify-center mt-12">
        <button
          className="px-8 py-3 bg-black text-white uppercase-headline transition-all duration-300 hover:bg-[#D04007] hover:scale-105"
          style={{ fontSize: '11px', letterSpacing: '0.2em' }}
          onClick={() => {
            window.location.hash = 'capsule'
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          VIEW CAPSULE
        </button>
      </div>
    </section>
  );
}
