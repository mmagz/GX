import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { fetchAPI } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type SimpleProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string | string[];
  variants?: Array<{ images?: string[] }>;
  slug?: string;
};

interface BundleOffersProps {
  currentProduct: SimpleProduct | null;
}

// Helper to get product image from various possible locations
// Match the pattern used in CapsulePage: check image[0] first, then variants
function getProductImage(product: SimpleProduct | null): string {
  if (!product) return '';
  
  // Try image array first (most common pattern)
  if (Array.isArray(product.image) && product.image.length > 0 && product.image[0]) {
    return product.image[0];
  }
  
  // Try image string (legacy)
  if (typeof product.image === 'string' && product.image) {
    return product.image;
  }
  
  // Try variants as fallback
  if (product.variants && product.variants.length > 0 && product.variants[0]?.images?.[0]) {
    return product.variants[0].images[0];
  }
  
  // Try images array (alternative)
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  
  return '';
}

export function BundleOffers({ currentProduct }: BundleOffersProps) {
  const { getToken } = useAuth();
  const [dropProducts, setDropProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const token = await getToken().catch(() => undefined);
        const data = await fetchAPI('/api/product/current-drop', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (isMounted) setDropProducts((data?.products || []) as SimpleProduct[]);
      } catch (e) {
        // fail silently – UI still renders with just the current product
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [getToken]);

  // Pick up to 3 other items from current drop distinct from current product
  const bundleItems = useMemo(() => {
    const others = dropProducts.filter(p => p._id !== currentProduct?._id);
    const picked = [...others].slice(0, 3);
    const items: SimpleProduct[] = [];
    if (currentProduct) items.push(currentProduct);
    items.push(...picked);
    return items.slice(0, 4);
  }, [dropProducts, currentProduct]);

  const navigateToCapsule = () => {
    window.location.hash = '#capsule';
  };

  const goMystery = () => {
    // For now, route to capsule; this can later open a dedicated mystery flow
    window.location.hash = '#capsule';
  };

  // Don't render if no current product
  if (!currentProduct) return null;

  return (
    <section className="mt-10 md:mt-14 mb-16 relative">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f9f7f0] via-white to-[#f9f7f0] opacity-50" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Bundle of four */}
        <div 
          className="relative rounded-lg p-8 md:p-12 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            border: '2px solid rgba(208, 64, 7, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(208, 64, 7, 0.1)',
          }}
        >
          {/* Orange gradient overlay */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(208, 64, 7, 0.5) 0%, transparent 70%)' }}
          />
          
          <div className="relative z-10 px-2">
            <h3 
              className="uppercase-headline mb-4 text-white drop-shadow-sm" 
              style={{ 
                fontSize: 'clamp(22px, 3.5vw, 30px)', 
                fontWeight: 800, 
                letterSpacing: '0.08em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Complete Your Collection
            </h3>
            <p 
              className="text-white mb-8 font-medium" 
              style={{ fontSize: '14px', lineHeight: '1.7' }}
            >
              Curated bundle of 4 essential pieces from our current drop
            </p>
            
            <Badge 
              className="mb-8 px-5 py-2.5 shadow-lg transition-all hover:scale-105" 
              style={{ 
                fontSize: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #D04007 0%, #b83706 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(208, 64, 7, 0.5)'
              }}
            >
              Save upto 50%
            </Badge>

            <div className="flex items-center gap-4 mb-8 overflow-x-auto py-3 px-2">
              {bundleItems.length > 0 ? (
                bundleItems.map((p, idx) => {
                  const imgSrc = getProductImage(p);
                  return (
                    <div 
                      key={p._id || idx} 
                      className="relative w-28 h-32 md:w-32 md:h-36 rounded-lg overflow-hidden shrink-0 group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20"
                      style={{
                        border: '2px solid rgba(38, 41, 48, 0.15)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                        boxShadow: '0 4px 12px rgba(38, 41, 48, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                      <ImageWithFallback
                        alt={p.name || 'Product'}
                        src={imgSrc}
                        fallbackSrc="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=480&q=60"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Plus sign between items (except last) */}
                      {idx < bundleItems.length - 1 && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                          <span className="text-white font-bold text-4xl drop-shadow-lg">+</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-white/60">Loading products...</div>
              )}
            </div>

            <div 
              className="text-white/90 space-y-2.5 text-[13px] leading-7 mb-8 pl-2"
              style={{ fontFamily: 'inherit' }}
            >
              <ul className="list-none space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Mix and match from our current capsule collection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Curated combinations to amplify your style</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Limited edition pieces with exclusive discounts</span>
                </li>
              </ul>
            </div>

            <Separator className="my-8 bg-gradient-to-r from-transparent via-[#D04007]/30 to-transparent h-px" />

            <div className="flex justify-between items-center flex-wrap gap-3">
              <Button 
                onClick={navigateToCapsule} 
                variant="outline" 
                className="uppercase tracking-wider border-2 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                style={{ 
                  fontSize: '12px', 
                  letterSpacing: '0.12em', 
                  padding: '12px 28px',
                  fontWeight: 700,
                  borderColor: '#D04007',
                  color: '#D04007',
                  background: 'transparent',
                  boxShadow: '0 4px 12px rgba(208, 64, 7, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D04007';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(208, 64, 7, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#D04007';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 64, 7, 0.2)';
                }}
              >
                DIVE DEEPER
              </Button>
            </div>
          </div>
        </div>

        {/* Product + surprise */}
        <div 
          className="relative rounded-lg p-8 md:p-12 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #1a0a00 0%, #2d1400 50%, #1a0a00 100%)',
            border: '2px solid rgba(208, 64, 7, 0.5)',
            boxShadow: '0 8px 32px rgba(208, 64, 7, 0.3), 0 4px 16px rgba(208, 64, 7, 0.2), inset 0 1px 0 rgba(208, 64, 7, 0.2)',
          }}
        >
          {/* Orange gradient overlay */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(208, 64, 7, 0.6) 0%, transparent 70%)' }}
          />
          
          <div className="relative z-10 px-2">
            <h3 
              className="uppercase-headline mb-4 text-white drop-shadow-sm" 
              style={{ 
                fontSize: 'clamp(22px, 3.5vw, 30px)', 
                fontWeight: 800, 
                letterSpacing: '0.08em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(208, 64, 7, 0.3)'
              }}
            >
              Mystery Box
            </h3>
            <p 
              className="text-white mb-8 font-medium" 
              style={{ fontSize: '14px', lineHeight: '1.7' }}
            >
              {currentProduct.name} + Exclusive surprise item
            </p>
            
            <Badge 
              className="mb-8 px-5 py-2.5 shadow-lg transition-all hover:scale-105" 
              style={{ 
                fontSize: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #D04007 0%, #ff6b1a 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(208, 64, 7, 0.6), 0 0 20px rgba(208, 64, 7, 0.3)'
              }}
            >
              Save 22% + Surprise
            </Badge>

            <div className="flex items-center gap-4 mb-8 overflow-x-auto py-3 px-2">
              <div 
                className="relative w-28 h-32 md:w-32 md:h-36 rounded-lg overflow-hidden shrink-0 group cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  border: '2px solid rgba(38, 41, 48, 0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                  boxShadow: '0 4px 12px rgba(38, 41, 48, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                {currentProduct ? (
                  <ImageWithFallback
                    alt={currentProduct.name || 'Product'}
                    src={getProductImage(currentProduct)}
                    fallbackSrc="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=480&q=60"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : null}
              </div>
              
              {/* Plus sign */}
              <div className="flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-4xl drop-shadow-lg">+</span>
              </div>
              
              {/* Mystery box - same size as product image */}
              <div 
                className="w-28 h-32 md:w-32 md:h-36 rounded-lg border-2 border-[#D04007]/40 shrink-0 flex items-center justify-center relative overflow-hidden"
                style={{
                  borderColor: 'rgba(208, 64, 7, 0.5)',
                  background: 'linear-gradient(135deg, rgba(208, 64, 7, 0.15) 0%, rgba(208, 64, 7, 0.08) 100%)',
                  boxShadow: '0 4px 12px rgba(208, 64, 7, 0.2), inset 0 1px 0 rgba(208, 64, 7, 0.3)',
                }}
              >
                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                  {/* Mystery Box Icon SVG */}
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(208, 64, 7, 0.6))' }}
                  >
                    {/* Open box base */}
                    <path 
                      d="M12 28 L12 48 L52 48 L52 28 L12 28 Z" 
                      stroke="#D04007" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Box left side */}
                    <path 
                      d="M12 28 L32 20 L52 28" 
                      stroke="#D04007" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Open flap left */}
                    <path 
                      d="M12 28 L20 24 L32 20" 
                      stroke="#D04007" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Open flap right */}
                    <path 
                      d="M52 28 L44 24 L32 20" 
                      stroke="#D04007" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Question mark */}
                    <path 
                      d="M28 38 C28 36 29 34 31 34 C33 34 34 36 34 38 C34 40 32 42 30 44" 
                      stroke="#D04007" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle 
                      cx="30" 
                      cy="46" 
                      r="1.5" 
                      fill="#D04007"
                    />
                    {/* Left sparkle */}
                    <g transform="translate(18, 36)">
                      <circle cx="0" cy="0" r="1.5" fill="#D04007" />
                      <line x1="0" y1="0" x2="-3" y2="-3" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="0" x2="3" y2="-3" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="0" x2="0" y2="-4" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                    {/* Right sparkle */}
                    <g transform="translate(46, 36)">
                      <circle cx="0" cy="0" r="1.5" fill="#D04007" />
                      <line x1="0" y1="0" x2="-3" y2="-3" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="0" x2="3" y2="-3" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="0" x2="0" y2="-4" stroke="#D04007" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  </svg>
                  <span className="text-white/80 text-xs uppercase tracking-wide font-bold mt-1">Surprise</span>
                </div>
              </div>
            </div>

            <div 
              className="text-white/90 space-y-2.5 text-[13px] leading-7 mb-8 pl-2"
              style={{ fontFamily: 'inherit' }}
            >
              <div className="font-bold mb-3 text-[#D04007] text-sm uppercase tracking-wide">Mystery Item Clues:</div>
              <ul className="list-none space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Exclusive item from our archive collection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Features unique design elements and patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D04007] font-bold mt-1">•</span>
                  <span>Worth ₹1999+ alone</span>
                </li>
              </ul>
            </div>

            <Separator className="my-8 bg-gradient-to-r from-transparent via-[#D04007]/40 to-transparent h-px" />

            <div className="flex justify-between items-center flex-wrap gap-3">
              <Button 
                onClick={goMystery} 
                variant="outline" 
                className="uppercase tracking-wider border-2 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                style={{ 
                  fontSize: '12px', 
                  letterSpacing: '0.12em', 
                  padding: '12px 28px',
                  fontWeight: 700,
                  borderColor: '#D04007',
                  color: '#D04007',
                  background: 'transparent',
                  boxShadow: '0 4px 12px rgba(208, 64, 7, 0.3), 0 0 15px rgba(208, 64, 7, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #D04007 0%, #ff6b1a 100%)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(208, 64, 7, 0.6), 0 0 25px rgba(208, 64, 7, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#D04007';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(208, 64, 7, 0.3), 0 0 15px rgba(208, 64, 7, 0.2)';
                }}
              >
                TAKE THE RISK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BundleOffers;


