import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatINR } from '../utils/format';

interface MasonryProductCardProps {
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

const MasonryProductCardComponent = ({ 
  id,
  name, 
  price, 
  image, 
  category, 
  slug,
  isNew = false,
  stock,
  colors = ['#000000']
}: MasonryProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => formatINR(price);
  // Database stock logic: Low stock when stock > 0 and <= 5
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  const handleCardClick = () => {
    const derivedSlug = slug || name.toLowerCase().replace(/\s+/g,'-');
    const search = id ? `?id=${encodeURIComponent(id)}` : '';
    window.location.hash = `product/${derivedSlug}${search}`;
  };

  // Editorial grid doesn't need fixed aspect ratios - CSS Grid handles sizing
  const getAspectRatioClass = () => {
    return 'w-full h-full';
  };

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer w-full h-full will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden bg-[#f5f5f5]">
        <ImageWithFallback 
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          loading="lazy"
        />
        
        {/* Badges - Top Left - Always Mounted, Toggle Visibility */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-30">
          <span 
            className={`bg-white/90 text-black px-2 py-1 uppercase-headline transition-opacity duration-300 ${
              isNew ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontSize: '7px', letterSpacing: '0.2em', fontWeight: 500 }}
          >
            NEW
          </span>

          <span 
            className={`bg-[#D04007]/90 text-white px-2 py-1 uppercase-headline transition-opacity duration-300 ${
              isLowStock && !isNew ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontSize: '7px', letterSpacing: '0.2em', fontWeight: 500 }}
          >
            LOW STOCK
          </span>

          <span 
            className={`bg-black/90 text-white px-2 py-1 uppercase-headline transition-opacity duration-300 ${
              stock === 0 && !isNew ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontSize: '7px', letterSpacing: '0.2em', fontWeight: 500 }}
          >
            SOLD OUT
          </span>
        </div>

        {/* Minimal Wishlist Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-4 right-4 p-2 transition-colors duration-200 z-30 ${
            isWishlisted 
              ? 'text-[#D04007]' 
              : 'text-white/80 hover:text-white'
          }`}
        >
          <Heart 
            size={14} 
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Minimal Product Info Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
          <p 
            className="text-white/80 uppercase-headline mb-1"
            style={{ fontSize: '8px', letterSpacing: '0.15em', fontWeight: 400 }}
          >
            {category}
          </p>
          <h3 
            className="text-white mb-2 uppercase-headline"
            style={{ fontSize: '12px', letterSpacing: '0.05em', fontWeight: 500, lineHeight: 1.2 }}
          >
            {name}
          </h3>
          
          {/* Minimal Color Swatches */}
          {colors.length > 0 && (
            <div className="flex gap-1 mb-2">
              {colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 border border-white/30"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colors.length > 3 && (
                <span 
                  className="flex items-center justify-center w-3 h-3 bg-white/20 text-white"
                  style={{ fontSize: '6px', fontWeight: 500 }}
                >
                  +{colors.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <p 
            className="text-white font-medium"
            style={{ fontSize: '14px', letterSpacing: '0.02em' }}
          >
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Performance optimization: Prevent unnecessary re-renders
export const MasonryProductCard = React.memo(MasonryProductCardComponent) as React.ComponentType<MasonryProductCardProps>;

export default MasonryProductCard;
