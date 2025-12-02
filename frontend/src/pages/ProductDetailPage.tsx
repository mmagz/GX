import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../components/WishlistContext';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, Star } from 'lucide-react';
import { formatINR } from '../utils/format';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useAuth } from '@clerk/clerk-react';
import { ProductLoader } from '../components/PageLoader';
import { fetchAPI } from '../utils/api';
import { BundleOffers } from '../components/BundleOffers';

const fallbackImages = [
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1080&q=80',
  'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=1080&q=80',
];

// Related products (dynamic)
type Related = { id: string; name: string; price: number; image: string; category: string; stock?: number; colors?: string[]; isNew?: boolean; slug?: string }

export function ProductDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [product, setProduct] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([] as Related[]);
  const { addItem, loading: cartLoading, optimisticAddItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  // Track hash changes reliably
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const afterHash = hash.replace(/^#/, '');
  const [pathPart, queryPart] = afterHash.split('?');
  const isIdInPath = pathPart.startsWith('product/id/');
  const slugFromPath = pathPart.replace(/^product\//, '').replace(/^id\//, '');
  const idFromQuery = new URLSearchParams(queryPart || '').get('id') || '';

  const isValidObjectId = (id:string) => /^[a-f\d]{24}$/i.test(id)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Product loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    (async () => {
      try {
        const token = await getToken().catch(() => undefined)
        // Prefer ID only if present and valid, else slug
        const idCandidate = isIdInPath ? slugFromPath : idFromQuery
        // Prefer ID first when a valid id is present in query or path → ensures price/data match with the clicked card
        const tryIdFirst = !!(((idFromQuery && isValidObjectId(idFromQuery)) || (isIdInPath && isValidObjectId(idCandidate))))
        let data: any = null
        if (tryIdFirst) {
          const idToUse = (idFromQuery && isValidObjectId(idFromQuery)) ? idFromQuery : idCandidate
          try {
            data = await fetchAPI(`/api/product/id/${idToUse}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
          } catch (error) {
            console.log('ID fetch failed, trying slug...')
          }
        }
        if (!data?.product) {
          try {
            data = await fetchAPI(`/api/product/slug/${slugFromPath}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
          } catch (error) {
            console.log('Slug fetch failed, trying fallback...')
          }
        }
        if (data?.product) { setProduct(normalizeProduct(data.product)); setLoading(false); return }
        // final fallback: if we didn't try id before but id exists, try it now
        if (!tryIdFirst && idFromQuery) {
          try {
            const data2 = await fetchAPI(`/api/product/id/${idFromQuery}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
            setProduct(data2.product ? normalizeProduct(data2.product) : null)
            setLoading(false); return
          } catch (error) {
            console.log('Final ID fallback failed')
          }
        }
        // final defensive fallback: query the list and match locally
        try {
          const listData = await fetchAPI(`/api/product/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
          const found = (listData?.products || []).find((p:any) => p._id === (idFromQuery || slugFromPath) || p.slug === slugFromPath)
          setProduct(found ? normalizeProduct(found) : null)
          setLoading(false)
        } catch {
          setProduct(null); setLoading(false)
        }
      } catch (e) {
        setProduct(null); setLoading(false)
      }
    })();

    // Cleanup timeout on unmount or dependency change
    return () => clearTimeout(timeoutId);
  }, [hash]);

  // load related products (simple: latest 4)
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken().catch(() => undefined)
        const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com'
        const res = await fetch(`${base}/api/product/list`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
        const data = await res.json()
        if (Array.isArray(data?.products)) {
          setRelatedProducts(
            data.products.slice(0,4).map((p:any) => ({
              id: p._id,
              name: p.name,
              price: p.price,
              image: p.image?.[0] || p.image || '',
              category: p.category,
              colors: (p.variants || []).map((v:any)=>v.colorHex),
              slug: p.slug,
            }))
          )
        }
      } catch {}
    })()
  }, [])

  const variants = product?.variants?.length ? product.variants : [];
  const [selectedColor, setSelectedColor] = useState(null as any);
  useEffect(() => {
    if (product?.variants?.length) setSelectedColor(product.variants[0])
    else setSelectedColor(null)
  }, [product?.variants])
  const images = selectedColor?.images?.length
    ? selectedColor.images
    : ((product?.image?.length ? product.image : []) || fallbackImages);
  const sizes = product?.sizes?.length ? product.sizes : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size', {
        description: 'Choose a size before adding to cart'
      });
      return;
    }

    if (!product?._id) {
      toast.error('Product not found');
      return;
    }

    // Add item with selected quantity (single call, no loop)
    const itemData = {
      productId: product._id,
      name: product.name || 'PRODUCT',
      price: product.price || 0,
      image: (selectedColor?.images?.[0]) || images[0],
      size: selectedSize,
      color: selectedColor?.colorName || 'DEFAULT',
      category: product.category || 'GENERAL'
    };
    
    // Use optimistic update for instant feedback (shows toast)
    optimisticAddItem(itemData, quantity);
    // Call backend for persistence (no toast - already shown above)
    await addItem(itemData, quantity, false);
  };

  const handleToggleWishlist = () => {
    if (!isInWishlist(product?._id || 'p')) {
      addToWishlist({
        id: product?._id || 'p',
        name: product?.name,
        price: product?.price,
        image: images[0],
        category: product?.category,
        inStock: true,
        stock: 12,
        colors: variants.map((v:any) => v.colorHex)
      });
    }
  };

  if (loading) {
    return <ProductLoader />;
  }

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 opacity-60" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              <a href="#" className="hover:text-[#D04007] transition-colors">HOME</a>
              <span>/</span>
              <a href="#capsule" className="hover:text-[#D04007] transition-colors">CAPSULE</a>
              <span>/</span>
              <span className="text-[#D04007]">{product?.name || 'PRODUCT'}</span>
            </div>
          </div>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-[#d0cdc7] rounded-sm overflow-hidden mb-4 group">
                <ImageWithFallback 
                  src={images[currentImageIndex]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#D04007] hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-[#D04007] hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'border-[#D04007]' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <ImageWithFallback 
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <p 
                  className="uppercase-headline text-[#D04007] mb-2"
                  style={{ fontSize: '10px', letterSpacing: '0.2em' }}
                >
                  {product?.subCategory || 'COLLECTION'}
                </p>
                <h1 
                  className="uppercase-headline mb-4"
                  style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '0.1em' }}
                >
                  {product?.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="#D04007" className="text-[#D04007]" />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>(128 reviews)</span>
                </div>

                {/* Price */}
                <p 
                  className="price-outlined mb-6"
                  style={{ fontSize: '32px', letterSpacing: '0.05em' }}
                >
                  {formatINR(product?.price || 0)}
                </p>

                {/* Description */}
                <p className="mb-6 leading-relaxed" style={{ fontSize: '13px', opacity: 0.85 }}>
                  {product?.description || '—'}
                </p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6 px-4 py-2 frosted-glass border border-white/30 rounded-sm w-fit">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="uppercase-headline" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    12 IN STOCK
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Color Selection */}
              <div className="mb-6">
                <label className="uppercase-headline mb-3 block" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                  COLOR: {selectedColor?.colorName || 'DEFAULT'}
                </label>
                <div className="flex gap-3">
                  {variants.map((color:any, idx:number) => (
                    <button
                      key={`variant-${idx}-${color.colorName}`}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        selectedColor?.colorName === color.colorName 
                          ? 'border-[#D04007] scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                      style={{ backgroundColor: color.colorHex }}
                      title={color.colorName}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="uppercase-headline" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                    SIZE: {selectedSize || 'SELECT SIZE'}
                  </label>
                  <button className="uppercase-headline text-[#D04007] hover:underline" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border-2 rounded-sm uppercase-headline transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-[#D04007] bg-[#D04007] text-white'
                          : 'border-white/30 hover:border-[#D04007] hover:bg-white/40'
                      }`}
                      style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="uppercase-headline mb-3 block" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                  QUANTITY
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 frosted-glass border border-white/30 rounded-sm hover:border-[#D04007] transition-colors"
                    style={{ fontSize: '18px' }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '16px', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 frosted-glass border border-white/30 rounded-sm hover:border-[#D04007] transition-colors"
                    style={{ fontSize: '18px' }}
                  >
                    +
                  </button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className={`w-full py-4 flex items-center justify-center gap-3 uppercase-headline transition-all duration-300 ${
                    cartLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-[#D04007] hover:scale-[1.02]'
                  }`}
                  style={{ fontSize: '12px', letterSpacing: '0.15em' }}
                >
                  {!cartLoading && <ShoppingCart size={18} />}
                  {cartLoading ? 'Loading...' : 'ADD TO CART'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-full py-4 flex items-center justify-center gap-3 border-2 uppercase-headline transition-all duration-300 ${
                    isInWishlist(product?._id || 'p')
                      ? 'border-[#D04007] bg-[#D04007] text-white'
                      : 'border-[#262930]/20 hover:border-[#D04007]'
                  }`}
                  style={{ fontSize: '12px', letterSpacing: '0.15em' }}
                >
                  <Heart size={18} fill={isInWishlist(product?._id || 'p') ? 'currentColor' : 'none'} />
                  {isInWishlist(product?._id || 'p') ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 frosted-glass border border-white/30 rounded-sm">
                  <Truck size={24} className="mx-auto mb-2 text-[#D04007]" />
                  <p className="uppercase-headline" style={{ fontSize: '9px', letterSpacing: '0.1em', opacity: 0.8 }}>
                    FREE SHIPPING
                  </p>
                </div>
                <div className="text-center p-4 frosted-glass border border-white/30 rounded-sm">
                  <RotateCcw size={24} className="mx-auto mb-2 text-[#D04007]" />
                  <p className="uppercase-headline" style={{ fontSize: '9px', letterSpacing: '0.1em', opacity: 0.8 }}>
                    30-DAY RETURNS
                  </p>
                </div>
                <div className="text-center p-4 frosted-glass border border-white/30 rounded-sm">
                  <Shield size={24} className="mx-auto mb-2 text-[#D04007]" />
                  <p className="uppercase-headline" style={{ fontSize: '9px', letterSpacing: '0.1em', opacity: 0.8 }}>
                    2-YEAR WARRANTY
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="details">DETAILS</TabsTrigger>
                <TabsTrigger value="sizing">SIZING & FIT</TabsTrigger>
                <TabsTrigger value="care">CARE INSTRUCTIONS</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="frosted-glass border border-white/30 rounded-sm p-6">
                <h3 className="uppercase-headline mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}>
                  PRODUCT DETAILS
                </h3>
                <div className="space-y-3" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  <p><strong>Material:</strong> 100% Premium Heavyweight Cotton (480 GSM)</p>
                  <p><strong>Origin:</strong> Made in India</p>
                  <p><strong>Features:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 opacity-80">
                    {(product?.details || []).map((d:string, i:number) => (
                      <li key={`detail-${i}`}>{d}</li>
                    ))}
                  </ul>
                  <p className="pt-2"><strong>SKU:</strong> XND-ESS-001-BLK</p>
                </div>
              </TabsContent>
              
              <TabsContent value="sizing" className="frosted-glass border border-white/30 rounded-sm p-6">
                <h3 className="uppercase-headline mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}>
                  SIZING & FIT
                </h3>
                <div className="space-y-4" style={{ fontSize: '13px' }}>
                  <p><strong>Fit:</strong> {product?.sizingFit || '—'}</p>
                  
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full" style={{ fontSize: '11px' }}>
                      <thead>
                        <tr className="border-b border-[#262930]/20">
                          <th className="py-2 px-4 text-left uppercase-headline">SIZE</th>
                          <th className="py-2 px-4 text-left uppercase-headline">CHEST (CM)</th>
                          <th className="py-2 px-4 text-left uppercase-headline">LENGTH (CM)</th>
                          <th className="py-2 px-4 text-left uppercase-headline">SLEEVE (CM)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(product?.sizeGuide || []).map((r:any, idx:number) => (
                          <tr key={`size-${idx}`} className="border-b border-[#262930]/10">
                            <td className="py-2 px-4">{r.size}</td>
                            <td className="py-2 px-4">{r.chest ?? '-'}</td>
                            <td className="py-2 px-4">{r.length ?? '-'}</td>
                            <td className="py-2 px-4">{r.sleeve ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="care" className="frosted-glass border border-white/30 rounded-sm p-6">
                <h3 className="uppercase-headline mb-4" style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}>
                  CARE INSTRUCTIONS
                </h3>
                <div className="space-y-3" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  <ul className="space-y-2 opacity-80">
                    {(product?.care || []).map((c:string, i:number) => (
                      <li key={`care-${i}`}>• {c}</li>
                    ))}
                  </ul>
                  <p className="pt-4">
                    <strong>Note:</strong> This garment has been pre-washed to minimize shrinkage. 
                    However, some slight shrinkage may occur after the first wash.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bundle Offers */}
          <BundleOffers currentProduct={product} />

          {/* Related Products */}
          <div>
            <h2 
              className="uppercase-headline mb-8 text-center"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, letterSpacing: '0.1em' }}
            >
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard id={p.id} name={p.name} price={p.price} image={p.image} category={p.category} colors={p.colors} slug={p.slug} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Normalize legacy product shapes into unified shape the UI expects
function normalizeProduct(raw:any){
  const p = { ...raw }
  // If variants missing, derive from legacy fields
  if (!Array.isArray(p.variants) || p.variants.length === 0) {
    const colors: string[] = Array.isArray(p.colors) ? p.colors : []
    const imagesByColor = p.imagesByColor || {}
    p.variants = colors.length
      ? colors.map((name:string) => ({
          colorName: String(name).toUpperCase(),
          colorHex: guessHex(name),
          images: Array.isArray(imagesByColor[name]) ? imagesByColor[name] : (Array.isArray(p.image) ? p.image : [])
        }))
      : []
  }
  if (!Array.isArray(p.image)) p.image = p.image ? [p.image] : []
  if (!Array.isArray(p.sizes)) p.sizes = []
  return p
}

function guessHex(name:string){
  const n = name.toLowerCase()
  if (n.includes('black')) return '#000000'
  if (n.includes('white')) return '#ffffff'
  if (n.includes('brown')) return '#654321'
  if (n.includes('blue')) return '#1e3a8a'
  if (n.includes('green')) return '#0f5132'
  if (n.includes('gray')||n.includes('grey')) return '#6b7280'
  return '#000000'
}
