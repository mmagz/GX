import React, { useCallback, useMemo } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { MasonryProductCard } from '../components/MasonryProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Package, TrendingUp, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchAPI } from '../utils/api';
import { PageLoader } from '../components/PageLoader';

const CapsuleGrid = React.memo(() => {
  const [items, setItems] = useState([] as any[])
  const [currentDrop, setCurrentDrop] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const abortControllerRef = useRef(null)
  
  const fetchProducts = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    const currentAbortController = abortControllerRef.current
    
    try {
      const token = await getToken().catch(() => undefined)
      const data = await fetchAPI('/api/product/current-drop', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: currentAbortController.signal
      })
      
      // Only update state if this request wasn't aborted
      if (!currentAbortController.signal.aborted) {
        setItems(data.products || [])
        setCurrentDrop(data.drop)
      }
    } catch (error: any) {
      // Silently ignore abort errors - they're expected during cleanup
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return;
      }
      console.error('Failed to fetch current drop products:', error)
    } finally {
      // Only set loading to false if this request wasn't aborted
      if (!currentAbortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [getToken])
  
  useEffect(() => {
    fetchProducts()
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchProducts])

  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return items.slice(0, 9).map((p: any, index: number) => {
      const fallbackVariantImg = p?.variants?.[0]?.images?.[0] || ''
      const img = (p?.image?.[0]) || fallbackVariantImg
      
      return (
        <div key={p._id}>
          <MasonryProductCard 
            id={p._id} 
            name={p.name} 
            price={p.price} 
            image={img} 
            category={p.category} 
            colors={p.variants?.map((v: any) => v.colorHex)} 
            slug={p.slug}
            isNew={index < 3} // First 3 items are "new"
            stock={p.stock || 0} // Real stock from database
          />
        </div>
      )
    })
  }, [items])

  // Editorial grid uses CSS Grid spans instead of aspect ratios
  
  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="md" text="LOADING PRODUCTS" />
      </div>
    )
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={64} className="mx-auto mb-6 text-white/30" />
        <h3 
          className="uppercase-headline text-white mb-3"
          style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
        >
          NO PRODUCTS FOUND
        </h3>
        <p className="text-white/60" style={{ fontSize: '13px' }}>
          Check back soon for new drops
        </p>
      </div>
    )
  }
  
  return (
    <div className="masonry-grid">
      {productCards}
    </div>
  )
})

CapsuleGrid.displayName = 'CapsuleGrid'

// Export the component for proper TypeScript recognition
export { CapsuleGrid }

export function CapsulePage() {
  const [bannerUrl, setBannerUrl] = useState('')
  const [currentDrop, setCurrentDrop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const { getToken } = useAuth()
  const abortControllerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  const fetchCurrentDrop = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    const currentAbortController = abortControllerRef.current
    
    try {
      const token = await getToken().catch(() => undefined)
      const data = await fetchAPI('/api/drop/current', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: currentAbortController.signal
      })
      
      // Only update state if this request wasn't aborted
      if (!currentAbortController.signal.aborted && data.success && data.drop) {
        setCurrentDrop(data.drop)
        setBannerUrl(data.drop.bannerUrl)
      }
    } catch (error: any) {
      // Silently ignore abort errors - they're expected during cleanup
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return;
      }
      console.error('Failed to fetch current drop:', error)
    } finally {
      // Only set loading to false if this request wasn't aborted
      if (!currentAbortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [getToken])

  useEffect(() => {
    fetchCurrentDrop()
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [fetchCurrentDrop])

  useEffect(() => {
    // Throttled scroll detection for better performance
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setScrollY(scrollY)
          
          // Debounced scroll indicator toggle
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          
          scrollTimeoutRef.current = setTimeout(() => {
            if (scrollY > 10) {
              setShowScrollIndicator(false)
            } else {
              setShowScrollIndicator(true)
            }
          }, 100) // 100ms debounce
          
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <PageLoader message="LOADING CAPSULE" size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnnouncementBar />
      <NavBar />
      
      {/* Fixed Hero Banner - Same as HomePage */}
      <div className="fixed inset-0 z-0">
        <div className="relative h-screen w-full flex items-center justify-center">
          {/* Hero Poster Image */}
          {bannerUrl && (
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          )}
          
          {/* Soft Gradient Overlay - Japanese inspired */}
          <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Hero Content - Editorial Layout */}
          <div className="relative z-[100] text-center max-w-5xl mx-auto px-8 animate-fade-in">
            {/* Drop Label - Japanese Calligraphy Style */}
            <div className="mb-12">
              <p 
                className="uppercase-headline text-white mb-2"
                style={{ 
                  fontSize: '12px', 
                  letterSpacing: '0.4em', 
                  fontWeight: 400,
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)'
                }}
              >
                {currentDrop ? `DROP #${currentDrop.dropCode.toString().padStart(3, '0')} — ${currentDrop.season} • ${currentDrop.productCount} PIECES • LIMITED` : 'DROP #001 — WINTER 2025 • 6 PIECES • LIMITED'}
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D04007] to-transparent mx-auto opacity-60" />
            </div>
            
            {/* Main Headline - Japanese */}
            <h1 
              className="uppercase-headline mb-8 text-white"
              style={{ 
                fontSize: 'clamp(64px, 12vw, 120px)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                lineHeight: 0.9,
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.6)'
              }}
            >
              {currentDrop ? currentDrop.name : 'カプセル'}
            </h1>
            
            {/* Subcopy - White text */}
            <p 
              className="mb-12 max-w-2xl mx-auto text-white"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                fontWeight: 300,
                lineHeight: 1.6,
                letterSpacing: '0.05em',
                textShadow: '0 2px 12px rgba(0,0,0,0.8)'
              }}
            >
              {currentDrop ? currentDrop.description : 'A curated selection of essential pieces. Where tradition meets contemporary streetwear.'}
            </p>

          </div>
        </div>
        
        {/* Scroll Indicator - Same as HomePage */}
        {showScrollIndicator && (
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white transition-all duration-300 hover:text-[#D04007] animate-bounce will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="uppercase-headline" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
              SCROLL
            </span>
            <ChevronDown size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>
      
      {/* Scrolling Content - positioned to start below viewport (like HomePage) */}
      <div 
        className="relative z-10"
        style={{ 
          marginTop: '100vh',
          boxShadow: '0 -0.08px 0.24px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Product Grid Section with Frosted Glass Background */}
        <section className="relative min-h-screen">
          {/* Blurred Background Continuation */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=800&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px) brightness(0.3) saturate(1.5)',
              opacity: 0.8,
              willChange: 'transform',
              transform: 'translateZ(0)' // Force GPU acceleration
            }}
          />
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
          
          {/* Frosted Glass Panel - High blur with transparency */}
          <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-3xl" />
          
          {/* Product Grid Content */}
          <div className="relative z-20 pt-20 pb-16">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
              <div className="text-center mb-16">
                <h2 
                  className="uppercase-headline text-white mb-4"
                  style={{ 
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)'
                  }}
                >
                  THE COLLECTION
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D04007] to-transparent mx-auto opacity-60" />
              </div>
              
              <div className="flex justify-center">
                <CapsuleGrid />
              </div>
              
              {/* Bottom note (CTA removed) */}
              <div className="text-center mt-20">
                <p 
                  className="mb-8 text-white/70"
                  style={{ fontSize: '14px', letterSpacing: '0.05em' }}
                >
                  All pieces are made to order with a 7-14 day production timeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section - Frosted Glass */}
        <section className="relative bg-white/10 backdrop-blur-3xl text-white py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/15" />
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 
                  className="uppercase-headline mb-4 text-white/90"
                  style={{ fontSize: '14px', letterSpacing: '0.15em', fontWeight: 500 }}
                >
                  PREMIUM MATERIALS
                </h3>
                <p 
                  className="text-white/70 leading-relaxed"
                  style={{ fontSize: '13px', letterSpacing: '0.02em' }}
                >
                  Each piece is crafted from carefully selected fabrics. We work exclusively 
                  with sustainable and ethically sourced materials.
                </p>
              </div>

              <div className="text-center">
                <h3 
                  className="uppercase-headline mb-4 text-white/90"
                  style={{ fontSize: '14px', letterSpacing: '0.15em', fontWeight: 500 }}
                >
                  LIMITED QUANTITIES
                </h3>
                <p 
                  className="text-white/70 leading-relaxed"
                  style={{ fontSize: '13px', letterSpacing: '0.02em' }}
                >
                  We produce small batches to ensure quality and exclusivity. Once a piece 
                  sells out, it may never return.
                </p>
              </div>

              <div className="text-center">
                <h3 
                  className="uppercase-headline mb-4 text-white/90"
                  style={{ fontSize: '14px', letterSpacing: '0.15em', fontWeight: 500 }}
                >
                  WORLDWIDE SHIPPING
                </h3>
                <p 
                  className="text-white/70 leading-relaxed"
                  style={{ fontSize: '13px', letterSpacing: '0.02em' }}
                >
                  Free express shipping on all orders. Delivered directly to your door within 
                  3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
}
