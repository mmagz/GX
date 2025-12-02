import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useCart } from '../components/CartContext';
import { useWishlist } from '../components/WishlistContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Heart, X } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';

export function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const { addToWishlist } = useWishlist();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const shipping = subtotal > 0 ? (subtotal >= 50000 ? 0 : 500) : 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax - discount;

  const moveToWishlist = (id: string) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        inStock: true,
        stock: 10,
        colors: ['#000000']
      });
      removeItem(id);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'XONED10') {
      setDiscount(subtotal * 0.1);
      setAppliedPromo(promoCode);
      toast.success('Promo code applied', {
        description: '10% discount added to your order'
      });
    } else if (promoCode.toUpperCase() === 'FIRSTDROP') {
      setDiscount(subtotal * 0.15);
      setAppliedPromo(promoCode);
      toast.success('Promo code applied', {
        description: '15% off for first-time customers'
      });
    } else {
      toast.error('Invalid promo code', {
        description: 'Try XONED10 or FIRSTDROP'
      });
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setDiscount(0);
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="uppercase-headline mb-2"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '0.1em' }}
            >
              SHOPPING CART
            </h1>
            <p className="opacity-70" style={{ fontSize: '13px' }}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={`${item.id}-${item.size}`}
                    className="frosted-glass border border-white/30 rounded-sm p-6 hover:border-[#D04007]/30 transition-colors duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-sm overflow-hidden bg-[#d0cdc7]">
                        <ImageWithFallback 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 
                              className="uppercase-headline mb-2"
                              style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                            >
                              {item.name}
                            </h3>
                            <div className="space-y-1" style={{ fontSize: '12px', opacity: 0.7 }}>
                              <p>Size: {item.size}</p>
                              <p>Color: {item.color}</p>
                            </div>
                          </div>
                          <p 
                            className="price-outlined"
                            style={{ fontSize: '18px' }}
                          >
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-3 frosted-glass border border-white/30 rounded-sm px-3 py-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="hover:text-[#D04007] transition-colors"
                              disabled={item.quantity === 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="hover:text-[#D04007] transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Actions */}
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="flex items-center gap-2 px-3 py-2 border border-white/30 rounded-sm hover:border-[#D04007] hover:text-[#D04007] transition-colors duration-300"
                            style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                          >
                            <Heart size={14} />
                            <span className="hidden sm:inline">SAVE</span>
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-2 px-3 py-2 border border-white/30 rounded-sm hover:border-red-500 hover:text-red-500 transition-colors duration-300"
                            style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">REMOVE</span>
                          </button>
                        </div>

                        {/* Subtotal for item */}
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="opacity-70" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                            SUBTOTAL: <span className="text-[#D04007]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="frosted-glass border border-white/30 rounded-sm p-6 sticky top-32">
                  <h2 
                    className="uppercase-headline mb-6"
                    style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    ORDER SUMMARY
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="uppercase-headline mb-2 block" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                      PROMO CODE
                    </label>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
                        <div>
                          <p className="uppercase-headline text-green-700" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                            {appliedPromo}
                          </p>
                          <p className="text-green-600" style={{ fontSize: '10px' }}>
                            -₹{discount.toLocaleString('en-IN')} applied
                          </p>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-green-700 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1"
                          style={{ fontSize: '12px' }}
                        />
                        <button
                          onClick={applyPromoCode}
                          className="px-4 py-2 bg-[#D04007] text-white rounded-sm hover:bg-[#ff6b1a] transition-colors duration-300"
                          style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                        >
                          APPLY
                        </button>
                      </div>
                    )}
                    <p className="mt-2 opacity-60" style={{ fontSize: '10px' }}>
                      Try: XONED10 or FIRSTDROP
                    </p>
                  </div>

                  <Separator className="my-6" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between" style={{ fontSize: '13px' }}>
                      <span className="opacity-70">Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '13px' }}>
                      <span className="opacity-70">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[#D04007]" style={{ fontSize: '10px' }}>
                        Add ₹{(50000 - subtotal).toLocaleString('en-IN')} more for free shipping
                      </p>
                    )}
                    <div className="flex justify-between" style={{ fontSize: '13px' }}>
                      <span className="opacity-70">Tax (GST 18%)</span>
                      <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600" style={{ fontSize: '13px' }}>
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span 
                      className="uppercase-headline"
                      style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      TOTAL
                    </span>
                    <span 
                      className="price-outlined"
                      style={{ fontSize: '24px' }}
                    >
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <a
                    href="#checkout"
                    className="w-full py-4 flex items-center justify-center gap-3 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-[1.02] mb-3"
                    style={{ fontSize: '12px', letterSpacing: '0.15em' }}
                  >
                    PROCEED TO CHECKOUT
                    <ArrowRight size={18} />
                  </a>

                  {/* Continue Shopping */}
                  <a
                    href="#capsule"
                    className="block text-center py-3 border border-[#262930]/20 rounded-sm hover:border-[#D04007] hover:text-[#D04007] transition-colors duration-300"
                    style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                  >
                    CONTINUE SHOPPING
                  </a>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-white/20 space-y-2" style={{ fontSize: '11px', opacity: 0.7 }}>
                    <p>✓ Secure checkout</p>
                    <p>✓ 30-day return policy</p>
                    <p>✓ Free shipping over ₹50,000</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart State
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto mb-6 opacity-30" />
              <h3 
                className="uppercase-headline mb-3"
                style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                YOUR CART IS EMPTY
              </h3>
              <p className="mb-8 opacity-70" style={{ fontSize: '13px' }}>
                Start adding items to your cart
              </p>
              <a
                href="#capsule"
                className="inline-block px-8 py-4 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-105"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                BROWSE COLLECTION
              </a>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
