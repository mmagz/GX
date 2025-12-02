import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useCart } from '../components/CartContext';
import { useAddress } from '../components/AddressContext';
import { useAuth } from '@clerk/clerk-react';
import { useAuth as useAuthContext } from '../components/AuthContext';
import { useOrders } from '../components/OrderContext';
import { AddressSelector } from '../components/AddressSelector';
import { isValidEmail, isValidIndianPhone, isValidPincode } from '../utils/performance';
import { Lock, CreditCard, Wallet, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Button } from '../components/ui/button';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutPage() {
  const { items: cartItems, subtotal: cartSubtotal, clearCart, loading: cartLoading } = useCart();
  const { addresses } = useAddress();
  const { isSignedIn, userId, getToken } = useAuth();
  const { login } = useAuthContext();
  const { fetchOrders } = useOrders();
  
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);


  // Calculate totals
  const subtotal = cartSubtotal;
  const shipping = subtotal >= 50000 ? 0 : (subtotal > 0 ? 500 : 0);
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Set default address on load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  const validateAddress = (address: any) => {
    const errors: string[] = [];
    
    if (!address.firstName?.trim()) errors.push('First name is required');
    if (!address.lastName?.trim()) errors.push('Last name is required');
    
    if (!address.email?.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(address.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!address.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!isValidIndianPhone(address.phone)) {
      errors.push('Please enter a valid 10-digit Indian phone number');
    }
    
    if (!address.address?.trim()) errors.push('Address is required');
    if (!address.city?.trim()) errors.push('City is required');
    if (!address.state?.trim()) errors.push('State is required');
    
    if (!address.pincode?.trim()) {
      errors.push('Pincode is required');
    } else if (!isValidPincode(address.pincode)) {
      errors.push('Please enter a valid 6-digit pincode');
    }
    
    return errors.length > 0 ? errors : null;
  };

  const proceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select or add an address', {
        description: 'You need to choose a shipping address to continue'
      });
      return;
    }

    const validationErrors = validateAddress(selectedAddress);
    
    if (validationErrors) {
      toast.error('Please fix the following errors:', {
        description: validationErrors.join(', ')
      });
      return;
    }

    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async () => {
    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const currentAddress = selectedAddress;
      
      const response = await fetch(`${base}/api/order/razorpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          address: currentAddress,
          subtotal,
          shipping,
          tax,
          total
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/order/verifyRazorpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  const createSimulatedOrder = async () => {
    try {
      const token = await getToken();
      const base = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

      const response = await fetch(`${base}/api/order/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          address: selectedAddress,
          subtotal,
          shipping,
          tax,
          total
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Simulated order creation error:', error);
      throw error;
    }
  };

  const handleSimulatedPayment = async () => {
    if (!isSignedIn || !userId) {
      toast.error('Please log in to place an order', {
        action: {
          label: 'Login',
          onClick: () => login()
        }
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order on backend with simulated payment
      const orderData = await createSimulatedOrder();
      
      if (orderData.success) {
        // Clear cart
        clearCart();
        
        // Set order details for success page
        setOrderDetails({
          orderNumber: orderData.orderNumber,
          orderId: orderData.orderId,
          address: selectedAddress,
          total,
          subtotal,
          shipping,
          tax,
          items: cartItems // Include cart items before clearing
        });
        
        setStep('success');
        toast.success('Payment successful!', {
          description: 'Your order has been placed successfully'
        });
      } else {
        throw new Error(orderData.message || 'Order creation failed');
      }
      
    } catch (error) {
      console.error('Payment simulation error:', error);
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDirectOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create order directly without payment simulation
      const orderData = await createSimulatedOrder();
      
      if (orderData.success) {
        // Clear cart
        clearCart();
        
        // Refresh orders to show the new order
        await fetchOrders();
        
        // Set order details for success page
        setOrderDetails({
          orderNumber: orderData.orderNumber,
          orderId: orderData.orderId,
          address: selectedAddress,
          total,
          subtotal,
          shipping,
          tax,
          items: cartItems // Include cart items before clearing
        });
        
        setStep('success');
        toast.success('Order placed successfully!', {
          description: 'Thank you for your purchase'
        });
      } else {
        toast.error('Failed to place order', {
          description: orderData.message || 'Please try again'
        });
      }
    } catch (error) {
      console.error('Direct order error:', error);
      toast.error('Order failed', {
        description: 'Please try again'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const placeOrder = async () => {
    // Skip payment simulation and go directly to success page
    await handleDirectOrder();
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <NavBar />
        
        <main className="pt-28 pb-16">
          <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center">
            <div className="mb-8 animate-fade-in">
              <div className="relative">
                <CheckCircle2 size={80} className="mx-auto mb-6 text-green-500 animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <h1 
                className="uppercase-headline mb-4 animate-slide-up"
                style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '0.1em' }}
              >
                ORDER CONFIRMED
              </h1>
              <p className="mb-2 animate-slide-up" style={{ fontSize: '15px', opacity: 0.85 }}>
                Thank you for your purchase!
              </p>
              <p className="mb-8 opacity-70 animate-slide-up" style={{ fontSize: '13px' }}>
                Order #{orderDetails?.orderNumber}
              </p>
            </div>

            <div className="frosted-glass border border-white/30 rounded-sm p-8 mb-8 text-left">
              <h2 
                className="uppercase-headline mb-6"
                style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                ORDER DETAILS
              </h2>
              
              <div className="space-y-3 mb-6">
                {orderDetails?.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center" style={{ fontSize: '13px' }}>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image || '/placeholder-product.jpg'} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                      <div>
                        <span className="opacity-80 block">
                          {item.name}
                        </span>
                        <span className="opacity-60 text-xs">
                          Qty: {item.quantity}
                    </span>
                      </div>
                    </div>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4" style={{ fontSize: '13px' }}>
                <div className="flex justify-between opacity-70">
                  <span>Subtotal</span>
                  <span>₹{orderDetails?.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between opacity-70">
                  <span>Shipping</span>
                  <span>{orderDetails?.shipping === 0 ? 'FREE' : `₹${orderDetails?.shipping}`}</span>
                </div>
                <div className="flex justify-between opacity-70">
                  <span>Tax (GST 18%)</span>
                  <span>₹{orderDetails?.tax?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span 
                  className="uppercase-headline"
                  style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                >
                  TOTAL PAID
                </span>
                <span 
                  className="price-outlined"
                  style={{ fontSize: '24px' }}
                >
                  ₹{orderDetails?.total?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="frosted-glass border border-white/30 rounded-sm p-6 mb-8 text-left">
              <h3 
                className="uppercase-headline mb-4"
                style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                SHIPPING ADDRESS
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.85 }}>
                {orderDetails?.address?.firstName} {orderDetails?.address?.lastName}<br />
                {orderDetails?.address?.address}{orderDetails?.address?.apartment && `, ${orderDetails?.address?.apartment}`}<br />
                {orderDetails?.address?.city}, {orderDetails?.address?.state} - {orderDetails?.address?.pincode}<br />
                {orderDetails?.address?.phone}
              </p>
            </div>

            {/* Order Timeline */}
            <div className="frosted-glass border border-white/30 rounded-sm p-6 mb-8">
              <h3 
                className="uppercase-headline mb-6"
                style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                ORDER TIMELINE
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs opacity-70">Just now</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm opacity-70">Order Confirmed</p>
                    <p className="text-xs opacity-50">Within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm opacity-70">Shipped</p>
                    <p className="text-xs opacity-50">Within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm opacity-70">Delivered</p>
                    <p className="text-xs opacity-50">5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="opacity-70" style={{ fontSize: '13px' }}>
                A confirmation email has been sent to <strong>{orderDetails?.address?.email}</strong>
              </p>
              <p className="opacity-70" style={{ fontSize: '13px' }}>
                You can track your order status in your account dashboard
              </p>
              <p className="opacity-70" style={{ fontSize: '13px' }}>
                For any queries, contact us at <strong>support@xoned.com</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => window.location.hash = '#account/orders'}
                className="px-8 py-4 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-105"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                VIEW ORDER STATUS
              </button>
              <button
                onClick={() => {
                  // Simple receipt download functionality
                  const receiptData = `
ORDER RECEIPT - XONED
Order Number: ${orderDetails?.orderNumber}
Date: ${new Date().toLocaleDateString('en-IN')}

ITEMS:
${orderDetails?.items?.map((item: any) => 
  `${item.name} × ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
).join('\n')}

SUBTOTAL: ₹${orderDetails?.subtotal?.toLocaleString('en-IN')}
SHIPPING: ${orderDetails?.shipping === 0 ? 'FREE' : `₹${orderDetails?.shipping}`}
TAX (GST 18%): ₹${orderDetails?.tax?.toLocaleString('en-IN')}
TOTAL: ₹${orderDetails?.total?.toLocaleString('en-IN')}

SHIPPING ADDRESS:
${orderDetails?.address?.firstName} ${orderDetails?.address?.lastName}
${orderDetails?.address?.address}${orderDetails?.address?.apartment ? `, ${orderDetails?.address?.apartment}` : ''}
${orderDetails?.address?.city}, ${orderDetails?.address?.state} - ${orderDetails?.address?.pincode}
Phone: ${orderDetails?.address?.phone}

Thank you for shopping with XONED!
                  `.trim();
                  
                  const blob = new Blob([receiptData], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `receipt-${orderDetails?.orderNumber}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  
                  toast.success('Receipt downloaded successfully!');
                }}
                className="px-8 py-4 border border-[#262930]/20 rounded-sm uppercase-headline transition-colors duration-300 hover:border-[#D04007]"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                DOWNLOAD RECEIPT
              </button>
              <button
                onClick={() => window.location.hash = '#capsule'}
                className="px-8 py-4 border border-[#262930]/20 rounded-sm uppercase-headline transition-colors duration-300 hover:border-[#D04007]"
                style={{ fontSize: '11px', letterSpacing: '0.2em' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <NavBar />
        
        <main className="pt-28 pb-16">
          <div className="max-w-[600px] mx-auto px-4 md:px-8 text-center">
            <div className="frosted-glass border border-white/30 rounded-sm p-8">
              <Lock size={64} className="mx-auto mb-6 text-white/50" />
              <h1 
                className="uppercase-headline mb-4"
                style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, letterSpacing: '0.1em' }}
              >
                SIGN IN REQUIRED
              </h1>
              <p className="mb-6 opacity-70" style={{ fontSize: '14px' }}>
                Please sign in to proceed with checkout
              </p>
              <Button
                onClick={() => login()}
                className="bg-[#D04007] hover:bg-[#ff6b1a] text-white uppercase-headline"
                style={{ fontSize: '12px', letterSpacing: '0.1em' }}
              >
                SIGN IN
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Show loading screen while cart is loading
  if (cartLoading) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <NavBar />
        
        <main className="pt-28 pb-16">
          <div className="max-w-[600px] mx-auto px-4 md:px-8 text-center">
            <div className="frosted-glass border border-white/30 rounded-sm p-8">
              <p className="text-[#262930]" style={{ fontSize: '16px' }}>
                Loading...
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <NavBar />
        
        <main className="pt-28 pb-16">
          <div className="max-w-[600px] mx-auto px-4 md:px-8 text-center">
            <div className="frosted-glass border border-white/30 rounded-sm p-8">
              <h1 
                className="uppercase-headline mb-4"
                style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, letterSpacing: '0.1em' }}
              >
                CART IS EMPTY
              </h1>
              <p className="mb-6 opacity-70" style={{ fontSize: '14px' }}>
                Add some items to your cart before checkout
              </p>
              <Button
                onClick={() => window.location.hash = '#capsule'}
                className="bg-[#D04007] hover:bg-[#ff6b1a] text-white uppercase-headline"
                style={{ fontSize: '12px', letterSpacing: '0.1em' }}
              >
                CONTINUE SHOPPING
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.location.hash = '#cart'}
              className="inline-flex items-center gap-2 mb-4 opacity-70 hover:opacity-100 hover:text-[#D04007] transition-colors"
              style={{ fontSize: '12px', letterSpacing: '0.05em' }}
            >
              <ArrowLeft size={16} />
              BACK TO CART
            </button>
            <h1 
              className="uppercase-headline mb-2"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '0.1em' }}
            >
              CHECKOUT
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className={`flex items-center gap-2 ${step === 'address' ? 'text-[#D04007]' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'address' ? 'border-[#D04007]' : 'border-current'}`}>
                  1
                </div>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em' }}>ADDRESS</span>
              </div>
              <div className="flex-1 h-px bg-white/30"></div>
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#D04007]' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-[#D04007]' : 'border-current'}`}>
                  2
                </div>
                <span style={{ fontSize: '11px', letterSpacing: '0.1em' }}>PAYMENT</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === 'address' && (
                <div className="space-y-8">
                  {/* Address Selector */}
                  <AddressSelector
                    selectedAddress={selectedAddress}
                    onAddressSelect={setSelectedAddress}
                    onAddressChange={setSelectedAddress}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={proceedToPayment}
                      className="flex-1 py-4 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-[1.02]"
                      style={{ fontSize: '12px', letterSpacing: '0.15em' }}
                    >
                      CONTINUE TO PAYMENT
                    </Button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-8">
                  {/* Payment Method */}
                  <div className="frosted-glass border border-white/30 rounded-sm p-6">
                    <h2 
                      className="uppercase-headline mb-6"
                      style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      PAYMENT METHOD
                    </h2>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        {/* Razorpay */}
                        <div className="flex items-center space-x-3 p-4 border border-white/30 rounded-sm hover:border-[#D04007] transition-colors cursor-pointer">
                          <RadioGroupItem value="razorpay" id="razorpay" />
                          <label
                            htmlFor="razorpay"
                            className="flex-1 flex items-center gap-3 cursor-pointer"
                          >
                            <CreditCard size={20} className="text-[#D04007]" />
                            <div>
                              <p className="uppercase-headline" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                                CREDIT/DEBIT CARD, UPI, NETBANKING
                              </p>
                              <p className="opacity-60" style={{ fontSize: '10px' }}>
                                Secured by Razorpay
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Cash on Delivery */}
                        <div className="flex items-center space-x-3 p-4 border border-white/30 rounded-sm hover:border-[#D04007] transition-colors cursor-pointer">
                          <RadioGroupItem value="cod" id="cod" />
                          <label
                            htmlFor="cod"
                            className="flex-1 flex items-center gap-3 cursor-pointer"
                          >
                            <Wallet size={20} className="text-[#D04007]" />
                            <div>
                              <p className="uppercase-headline" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>
                                CASH ON DELIVERY
                              </p>
                              <p className="opacity-60" style={{ fontSize: '10px' }}>
                                Pay when you receive
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-4 frosted-glass border border-white/30 rounded-sm">
                    <Lock size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <div style={{ fontSize: '12px' }}>
                      <p className="mb-1 opacity-90">
                        Your payment information is secure and encrypted
                      </p>
                      <p className="opacity-60" style={{ fontSize: '11px' }}>
                        We never store your card details
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setStep('address')}
                      variant="outline"
                      className="px-6 py-4 border border-[#262930]/20 rounded-sm uppercase-headline transition-colors duration-300 hover:border-[#D04007]"
                      style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                    >
                      BACK
                    </Button>
                    <Button
                      onClick={placeOrder}
                      disabled={isProcessingPayment}
                      className="flex-1 py-4 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontSize: '12px', letterSpacing: '0.15em' }}
                    >
                      {isProcessingPayment ? (
                        'Loading...'
                      ) : (
                        <>
                      <Lock size={16} />
                      COMPLETE ORDER - ₹{total.toLocaleString('en-IN')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="frosted-glass border border-white/30 rounded-sm p-6 sticky top-32">
                <h2 
                  className="uppercase-headline mb-6"
                  style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
                >
                  ORDER SUMMARY
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-[#d0cdc7] rounded-sm overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#D04007] text-white rounded-full flex items-center justify-center" style={{ fontSize: '10px' }}>
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="uppercase-headline mb-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                          {item.name}
                        </p>
                        <p className="opacity-60" style={{ fontSize: '10px' }}>
                          {item.size} / {item.color}
                        </p>
                        <p className="mt-1" style={{ fontSize: '12px' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '13px' }}>
                    <span className="opacity-70">Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Total */}
                <div className="flex justify-between items-center">
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
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}