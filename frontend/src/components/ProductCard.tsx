import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatINR } from '@/utils/format';
import { useWishlist } from './WishlistContext';
import { useAuth } from '@clerk/clerk-react';
import { useNavigation } from './NavigationLoader';

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug?: string;
  isNew?: boolean;
  stock?: number;
  colors?: string[];
}

export function ProductCard({ 
  id,
  name, 
  price, 
  image, 
  category, 
  slug,
  isNew = false,
  stock,
  colors = ['#000000']
}: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isSignedIn } = useAuth();
  const { navigateWithLoading } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  
  const isWishlisted = id ? isInWishlist(id) : false;

  const formatPrice = (price: number) => formatINR(price);

  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  const handleCardClick = () => {
    const derivedSlug = slug || name.toLowerCase().replace(/\s+/g,'-');
    // Prefer slug route for readability; include id as query fallback
    const search = id ? `?id=${encodeURIComponent(id)}` : '';
    navigateWithLoading(`#product/${derivedSlug}${search}`);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!id) return;
    
    if (isWishlisted) {
      await removeFromWishlist(id);
    } else {
      // Pass product data for better optimistic updates
      const productData = {
        name,
        price,
        image,
        category
      };
      await addToWishlist(id, productData);
    }
  };

  return (
    <div 
      className="group relative frosted-glass border border-white/30 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D04007]/30 cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{ zIndex: isHovered ? 10 : 1 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#d0cdc7]">
        <ImageWithFallback 
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span 
              className="bg-black text-white px-2 py-1 uppercase-headline"
              style={{ fontSize: '8px', letterSpacing: '0.1em' }}
            >
              NEW
            </span>
          )}
          {isLowStock && (
            <span 
              className="bg-[#D04007] text-white px-2 py-1 uppercase-headline"
              style={{ fontSize: '8px', letterSpacing: '0.1em' }}
            >
              LOW STOCK
            </span>
          )}
          {stock === 0 && (
            <span 
              className="bg-[#404040] text-white px-2 py-1 uppercase-headline"
              style={{ fontSize: '8px', letterSpacing: '0.1em' }}
            >
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            isWishlisted 
              ? 'bg-[#D04007] text-white' 
              : 'bg-white/80 text-[#262930] hover:bg-white'
          }`}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick Add to Cart - Appears on Hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <button 
            className="w-full py-3 flex items-center justify-center gap-2 text-white uppercase-headline transition-colors duration-300 hover:bg-[#D04007]"
            style={{ fontSize: '10px', letterSpacing: '0.15em' }}
            disabled={stock === 0}
          >
            <ShoppingCart size={14} />
            {stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p 
          className="uppercase-headline text-[#404040] mb-1"
          style={{ fontSize: '9px', letterSpacing: '0.15em' }}
        >
          {category}
        </p>
        <h3 
          className="uppercase-headline mb-2"
          style={{ fontSize: '12px', letterSpacing: '0.05em', fontWeight: 500 }}
        >
          {name}
        </h3>
        
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1 mb-3">
            {colors.slice(0, 4).map((color, index) => (
              <button
                key={index}
                className="w-4 h-4 rounded-full border border-white/50 transition-transform duration-200 hover:scale-125"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length > 4 && (
              <span 
                className="flex items-center justify-center w-4 h-4 rounded-full bg-[#404040]/20 text-[#262930]"
                style={{ fontSize: '8px' }}
              >
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <p 
          className="price-outlined"
          style={{ fontSize: '16px', letterSpacing: '0.05em' }}
        >
          {formatPrice(price)}
        </p>
      </div>
    </div>
  );
}