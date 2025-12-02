import { useState } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { toast } from 'sonner@2.0.3';

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    colors?: string[];
  };
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function QuickView({ isOpen, onClose, product }: QuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const { addItem } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem({
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: 'Default',
      category: product.category
    });
    onClose();
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: true,
      stock: 10,
      colors: product.colors || ['#000000']
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl frosted-glass border border-white/30">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-white rounded overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <DialogHeader className="mb-4">
              <p className="uppercase-headline opacity-60 mb-2" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                {product.category}
              </p>
              <DialogTitle className="uppercase-headline" style={{ fontSize: '24px', letterSpacing: '0.1em' }}>
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <p className="price-outlined mb-6" style={{ fontSize: '28px' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="uppercase-headline mb-3 block" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                SELECT SIZE
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border-2 rounded-sm uppercase-headline transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-[#D04007] bg-[#D04007] text-white'
                        : 'border-[#262930]/20 hover:border-[#D04007]'
                    }`}
                    style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-auto">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#262930] hover:bg-[#D04007] text-white uppercase-headline h-12"
                style={{ fontSize: '11px', letterSpacing: '0.15em' }}
              >
                <ShoppingCart size={16} className="mr-2" />
                ADD TO CART
              </Button>
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                className="w-full border-[#262930]/20 hover:border-[#D04007] uppercase-headline h-12"
                style={{ fontSize: '11px', letterSpacing: '0.15em' }}
              >
                <Heart size={16} className="mr-2" />
                ADD TO WISHLIST
              </Button>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-center opacity-60 hover:opacity-100 hover:text-[#D04007] transition-colors uppercase-headline"
              style={{ fontSize: '10px', letterSpacing: '0.1em' }}
            >
              VIEW FULL DETAILS
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
