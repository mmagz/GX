import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { useWishlist } from '../components/WishlistContext';
import { useAddress } from '../components/AddressContext';
import { useOrders } from '../components/OrderContext';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Heart, 
  Package, 
  Settings, 
  LogOut,
  Edit,
  Truck,
  CheckCircle2,
  Clock,
  X,
  Plus,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
// Fix TypeScript Button component type issue
const ButtonComponent = Button as any;
import { isValidEmail, isValidIndianPhone, isValidPincode } from '../utils/performance';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

// Get user data from Clerk authentication
const getUserData = (user: any, orders: any[] = []) => {
  if (!user) {
    return {
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '',
      avatar: '',
      joinDate: 'Recently',
      totalOrders: 0,
      totalSpent: 0
    };
  }

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || user.emailAddresses?.[0]?.emailAddress || 'User';
  
  // Calculate total orders and spent from actual orders
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  return {
    name: fullName,
    email: user.emailAddresses?.[0]?.emailAddress || '',
    phone: user.phoneNumbers?.[0]?.phoneNumber || '',
    avatar: user.imageUrl || '',
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    totalOrders,
    totalSpent
  };
};



const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle2 size={20} className="text-green-500" />;
    case 'shipped':
      return <Truck size={20} className="text-[#D04007]" />;
    case 'processing':
      return <Clock size={20} className="text-yellow-600" />;
    default:
      return <Package size={20} />;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, any> = {
    delivered: 'default',
    shipped: 'secondary',
    processing: 'outline'
  };
  
  return (
    <Badge 
      variant={variants[status]} 
      className={status === 'shipped' ? 'bg-[#D04007] text-white' : ''}
    >
      {status.toUpperCase()}
    </Badge>
  );
};

export function AccountPage() {
  const { user } = useUser();
  const { items: wishlistItems } = useWishlist();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
  const { orders, loading: ordersLoading, getOrderStatus } = useOrders();
  
  // Get real user data from Clerk
  const userData = getUserData(user, orders);
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'account/wishlist') return 'wishlist';
    if (hash === 'account/addresses') return 'addresses';
    return 'orders';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  const [newAddressErrors, setNewAddressErrors] = useState({});
  const [editingAddressErrors, setEditingAddressErrors] = useState({});

  const validateAddressForm = (address: any, isEdit = false) => {
    const errors: Record<string, string> = {};
    
    if (!address.firstName?.trim()) { errors.firstName = 'First name is required'; }
    if (!address.lastName?.trim()) { errors.lastName = 'Last name is required'; }
    
    if (!address.email?.trim()) { errors.email = 'Email is required'; } 
    else if (!isValidEmail(address.email)) { errors.email = 'Please enter a valid email address'; }
    
    if (!address.phone?.trim()) { errors.phone = 'Phone number is required'; } 
    else if (!isValidIndianPhone(address.phone)) { errors.phone = 'Please enter a valid 10-digit Indian phone number'; }
    
    if (!address.address?.trim()) { errors.address = 'Address is required'; }
    if (!address.city?.trim()) { errors.city = 'City is required'; }
    if (!address.state?.trim()) { errors.state = 'State is required'; }
    
    if (!address.pincode?.trim()) { errors.pincode = 'Pincode is required'; } 
    else if (!isValidPincode(address.pincode)) { errors.pincode = 'Please enter a valid 6-digit pincode'; }
    
    if (isEdit) { setEditingAddressErrors(errors); } 
    else { setNewAddressErrors(errors); }
    
    return Object.keys(errors).length === 0;
  };

  const handleNewAddressChange = (field: string, value: string | boolean) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (newAddressErrors[field]) {
      setNewAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEditingAddressChange = (field: string, value: string | boolean) => {
    setEditingAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (editingAddressErrors[field]) {
      setEditingAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddAddress = async () => {
    if (!validateAddressForm(newAddress, false)) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const success = await addAddress(newAddress);
    if (success) {
      setIsAddDialogOpen(false);
      setNewAddress({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
      });
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress) return;
    
    if (!validateAddressForm(editingAddress, true)) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    const success = await updateAddress(editingAddress._id, editingAddress);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    toast.error('Delete Address', {
      description: 'Are you sure you want to delete this address?',
      action: {
        label: 'Delete',
        onClick: async () => {
          await deleteAddress(addressId);
        }
      }
    });
  };

  const handleSetDefault = async (addressId: string) => {
    await setDefaultAddress(addressId);
  };

  const openEditDialog = (address: any) => {
    setEditingAddress({ ...address });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <NavBar />
      
      <main className="pt-28 pb-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {/* Header with User Info */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <Avatar className="w-24 h-24 border-4 border-white/30">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-[#D04007] text-white text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 
                  className="uppercase-headline mb-2"
                  style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '0.1em' }}
                >
                  {userData.name}
                </h1>
                <p className="opacity-70 mb-3" style={{ fontSize: '13px' }}>
                  {userData.email}
                </p>
                <div className="flex flex-wrap gap-4" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  <div className="px-3 py-1 frosted-glass border border-white/30 rounded-full">
                    MEMBER SINCE {userData.joinDate.toUpperCase()}
                  </div>
                  <div className="px-3 py-1 frosted-glass border border-white/30 rounded-full">
                    {userData.totalOrders} ORDERS
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success('Logged out successfully', {
                    description: 'See you soon!'
                  });
                  // In a real app, would handle logout logic here
                }}
                className="flex items-center gap-2 px-4 py-2 border border-[#262930]/20 rounded-sm hover:bg-[#D04007] hover:text-white hover:border-[#D04007] transition-all duration-300"
                style={{ fontSize: '11px', letterSpacing: '0.1em' }}
              >
                <LogOut size={16} />
                LOGOUT
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package size={16} />
                <span className="hidden sm:inline">ORDERS</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart size={16} />
                <span className="hidden sm:inline">WISHLIST</span>
              </TabsTrigger>
              {/* <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">PROFILE</span>
              </TabsTrigger> */}
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="hidden sm:inline">ADDRESSES</span>
              </TabsTrigger>
              {/* <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} />
                <span className="hidden sm:inline">SETTINGS</span>
              </TabsTrigger> */}
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="uppercase-headline"
                    style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    ORDER HISTORY
                  </h2>
                  <p className="opacity-70" style={{ fontSize: '12px' }}>
                    {orders.length} Orders
                  </p>
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-[#262930]" style={{ fontSize: '16px' }}>Loading...</p>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="uppercase-headline mb-2" style={{ fontSize: '16px', letterSpacing: '0.1em' }}>
                      NO ORDERS YET
                    </h3>
                    <p className="opacity-70" style={{ fontSize: '12px' }}>
                      Your order history will appear here
                    </p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const statusInfo = getOrderStatus(order.status);
                    return (
                      <div 
                        key={order._id}
                        className="frosted-glass border border-white/30 rounded-sm p-6 hover:border-[#D04007]/30 transition-colors duration-300"
                      >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p 
                            className="uppercase-headline mb-1"
                            style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: 600 }}
                          >
                            {order.orderNumber}
                          </p>
                          <p className="opacity-60" style={{ fontSize: '11px' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge 
                          className={statusInfo.color}
                          style={{ fontSize: '10px', letterSpacing: '0.05em' }}
                        >
                          {statusInfo.label.toUpperCase()}
                        </Badge>
                        <p 
                          className="price-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
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
                              <p className="uppercase-headline" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                                {item.name}
                              </p>
                              <p className="opacity-60" style={{ fontSize: '10px' }}>
                                Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                              </p>
                            </div>
                          </div>
                          <p style={{ fontSize: '12px' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Progress */}
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs opacity-70">Order Progress</span>
                        <span className="text-xs opacity-70">Step {statusInfo.step} of 4</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-2 flex-1 rounded-full ${
                              step <= statusInfo.step 
                                ? statusInfo.progressColor 
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {['Order Placed', 'Order Confirmed', 'Shipped', 'Delivered'].map((label, idx) => (
                          <span 
                            key={label}
                            className={`text-xs ${
                              idx + 1 <= statusInfo.step ? 'opacity-100' : 'opacity-40'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="uppercase-headline"
                    style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    MY WISHLIST
                  </h2>
                  <p className="opacity-70" style={{ fontSize: '12px' }}>
                    {wishlistItems?.length || 0} Items
                  </p>
                </div>

                {wishlistItems && wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <ProductCard 
                        key={item.productId}
                        id={item.productId}
                        name={item.name}
                        price={item.price}
                        image={item.image}
                        category={item.category}
                        {...({} as any)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 frosted-glass border border-white/30 rounded-sm">
                    <Heart size={48} className="mx-auto mb-4 opacity-30" />
                    <h3 
                      className="uppercase-headline mb-2"
                      style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      YOUR WISHLIST IS EMPTY
                    </h3>
                    <p className="mb-6 opacity-70" style={{ fontSize: '13px' }}>
                      Save your favorite items for later
                    </p>
                    <a
                      href="#capsule"
                      className="inline-block px-6 py-3 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a] hover:scale-105"
                      style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                    >
                      BROWSE COLLECTION
                    </a>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="uppercase-headline"
                    style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    PROFILE INFORMATION
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#262930]/20 rounded-sm hover:border-[#D04007] hover:text-[#D04007] transition-colors duration-300"
                    style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                  >
                    <Edit size={14} />
                    {isEditing ? 'CANCEL' : 'EDIT'}
                  </button>
                </div>

                <div className="frosted-glass border border-white/30 rounded-sm p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          FIRST NAME
                        </Label>
                        <Input 
                          id="firstName"
                          defaultValue="Alex"
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          LAST NAME
                        </Label>
                        <Input 
                          id="lastName"
                          defaultValue="Chen"
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                        EMAIL
                      </Label>
                      <Input 
                        id="email"
                        type="email"
                        defaultValue={userData.email}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                        PHONE NUMBER
                      </Label>
                      <Input 
                        id="phone"
                        type="tel"
                        defaultValue={userData.phone}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            toast.success('Profile updated', {
                              description: 'Your changes have been saved'
                            });
                          }}
                          className="flex-1 py-3 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a]"
                          style={{ fontSize: '11px', letterSpacing: '0.15em' }}
                        >
                          SAVE CHANGES
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 py-3 border border-[#262930]/20 uppercase-headline transition-colors duration-300 hover:border-[#D04007]"
                          style={{ fontSize: '11px', letterSpacing: '0.15em' }}
                        >
                          CANCEL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="uppercase-headline"
                    style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
                  >
                    SAVED ADDRESSES
                  </h2>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-[#D04007] text-white rounded-sm hover:bg-[#ff6b1a] transition-colors duration-300"
                        style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                      >
                        <Plus size={14} />
                        ADD NEW ADDRESS
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              value={newAddress.firstName}
                              onChange={(e) => handleNewAddressChange('firstName', e.target.value)}
                              className={newAddressErrors.firstName ? 'border-red-500' : ''}
                            />
                            {newAddressErrors.firstName && (
                              <p className="text-red-500 text-xs mt-1">{newAddressErrors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              value={newAddress.lastName}
                              onChange={(e) => handleNewAddressChange('lastName', e.target.value)}
                              className={newAddressErrors.lastName ? 'border-red-500' : ''}
                            />
                            {newAddressErrors.lastName && (
                              <p className="text-red-500 text-xs mt-1">{newAddressErrors.lastName}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newAddress.email}
                            onChange={(e) => handleNewAddressChange('email', e.target.value)}
                            className={newAddressErrors.email ? 'border-red-500' : ''}
                          />
                          {newAddressErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{newAddressErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                            className={newAddressErrors.phone ? 'border-red-500' : ''}
                          />
                          {newAddressErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{newAddressErrors.phone}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            value={newAddress.address}
                            onChange={(e) => handleNewAddressChange('address', e.target.value)}
                            placeholder="Street address"
                            className={newAddressErrors.address ? 'border-red-500' : ''}
                          />
                          {newAddressErrors.address && (
                            <p className="text-red-500 text-xs mt-1">{newAddressErrors.address}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                          <Input
                            id="apartment"
                            value={newAddress.apartment}
                            onChange={(e) => handleNewAddressChange('apartment', e.target.value)}
                            placeholder="Apartment, suite, etc. (optional)"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => handleNewAddressChange('city', e.target.value)}
                              className={newAddressErrors.city ? 'border-red-500' : ''}
                            />
                            {newAddressErrors.city && (
                              <p className="text-red-500 text-xs mt-1">{newAddressErrors.city}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) => handleNewAddressChange('state', e.target.value)}
                              className={newAddressErrors.state ? 'border-red-500' : ''}
                            />
                            {newAddressErrors.state && (
                              <p className="text-red-500 text-xs mt-1">{newAddressErrors.state}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                              id="pincode"
                              value={newAddress.pincode}
                              onChange={(e) => handleNewAddressChange('pincode', e.target.value)}
                              className={newAddressErrors.pincode ? 'border-red-500' : ''}
                            />
                            {newAddressErrors.pincode && (
                              <p className="text-red-500 text-xs mt-1">{newAddressErrors.pincode}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) => handleNewAddressChange('isDefault', e.target.checked)}
                          />
                          <Label htmlFor="isDefault">Set as default address</Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <ButtonComponent
                            onClick={handleAddAddress}
                            className="flex-1 bg-[#D04007] hover:bg-[#ff6b1a]"
                          >
                            ADD ADDRESS
                          </ButtonComponent>
                          <ButtonComponent
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                          >
                            CANCEL
                          </ButtonComponent>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {addressesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-[#262930]" style={{ fontSize: '16px' }}>Loading...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin size={48} className="mx-auto mb-4 text-[#262930]/50" />
                    <h3 className="uppercase-headline mb-2 text-[#262930]" style={{ fontSize: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>
                      NO ADDRESSES SAVED
                    </h3>
                    <p className="opacity-70 text-[#262930]" style={{ fontSize: '13px' }}>
                      Add your first address to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div 
                        key={address._id}
                        className="frosted-glass border border-white/30 rounded-sm p-6 hover:border-[#D04007]/30 transition-colors duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={address.isDefault ? 'default' : 'outline'} className={address.isDefault ? 'bg-[#D04007]' : ''}>
                              {address.isDefault ? 'HOME' : 'ADDRESS'}
                            </Badge>
                            {address.isDefault && (
                              <span className="uppercase-headline text-[#D04007]" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => openEditDialog(address)}
                            className="text-[#262930]/40 hover:text-[#D04007] transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        </div>

                        <div className="space-y-1" style={{ fontSize: '13px' }}>
                          <p className="uppercase-headline" style={{ fontSize: '12px', letterSpacing: '0.05em', fontWeight: 600 }}>
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="opacity-80">{address.address}{address.apartment && `, ${address.apartment}`}</p>
                          <p className="opacity-80">{address.city}, {address.state} - {address.pincode}</p>
                          <p className="opacity-70">Phone: {address.phone}</p>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address._id)}
                              className="flex-1 py-2 border border-[#262930]/20 rounded-sm hover:border-[#D04007] hover:text-[#D04007] transition-colors duration-300"
                              style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                            >
                              SET AS DEFAULT
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="py-2 px-4 text-red-500 hover:bg-red-50 rounded-sm transition-colors duration-300"
                            style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Address Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Address</DialogTitle>
                  </DialogHeader>
                  {editingAddress && (
                    <div className="space-y-4 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-firstName">First Name *</Label>
                          <Input
                            id="edit-firstName"
                            value={editingAddress.firstName}
                            onChange={(e) => handleEditingAddressChange('firstName', e.target.value)}
                            className={editingAddressErrors.firstName ? 'border-red-500' : ''}
                          />
                          {editingAddressErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{editingAddressErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="edit-lastName">Last Name *</Label>
                          <Input
                            id="edit-lastName"
                            value={editingAddress.lastName}
                            onChange={(e) => handleEditingAddressChange('lastName', e.target.value)}
                            className={editingAddressErrors.lastName ? 'border-red-500' : ''}
                          />
                          {editingAddressErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{editingAddressErrors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email *</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editingAddress.email}
                          onChange={(e) => handleEditingAddressChange('email', e.target.value)}
                          className={editingAddressErrors.email ? 'border-red-500' : ''}
                        />
                        {editingAddressErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{editingAddressErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="edit-phone">Phone *</Label>
                        <Input
                          id="edit-phone"
                          type="tel"
                          value={editingAddress.phone}
                          onChange={(e) => handleEditingAddressChange('phone', e.target.value)}
                          className={editingAddressErrors.phone ? 'border-red-500' : ''}
                        />
                        {editingAddressErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{editingAddressErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="edit-address">Address *</Label>
                        <Input
                          id="edit-address"
                          value={editingAddress.address}
                          onChange={(e) => handleEditingAddressChange('address', e.target.value)}
                          placeholder="Street address"
                          className={editingAddressErrors.address ? 'border-red-500' : ''}
                        />
                        {editingAddressErrors.address && (
                          <p className="text-red-500 text-xs mt-1">{editingAddressErrors.address}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="edit-apartment">Apartment, Suite, etc.</Label>
                        <Input
                          id="edit-apartment"
                          value={editingAddress.apartment || ''}
                          onChange={(e) => handleEditingAddressChange('apartment', e.target.value)}
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="edit-city">City *</Label>
                          <Input
                            id="edit-city"
                            value={editingAddress.city}
                            onChange={(e) => handleEditingAddressChange('city', e.target.value)}
                            className={editingAddressErrors.city ? 'border-red-500' : ''}
                          />
                          {editingAddressErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{editingAddressErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="edit-state">State *</Label>
                          <Input
                            id="edit-state"
                            value={editingAddress.state}
                            onChange={(e) => handleEditingAddressChange('state', e.target.value)}
                            className={editingAddressErrors.state ? 'border-red-500' : ''}
                          />
                          {editingAddressErrors.state && (
                            <p className="text-red-500 text-xs mt-1">{editingAddressErrors.state}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="edit-pincode">Pincode *</Label>
                          <Input
                            id="edit-pincode"
                            value={editingAddress.pincode}
                            onChange={(e) => handleEditingAddressChange('pincode', e.target.value)}
                            className={editingAddressErrors.pincode ? 'border-red-500' : ''}
                          />
                          {editingAddressErrors.pincode && (
                            <p className="text-red-500 text-xs mt-1">{editingAddressErrors.pincode}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-isDefault"
                          checked={editingAddress.isDefault}
                          onChange={(e) => handleEditingAddressChange('isDefault', e.target.checked)}
                        />
                        <Label htmlFor="edit-isDefault">Set as default address</Label>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <ButtonComponent
                          onClick={handleEditAddress}
                          className="flex-1 bg-[#D04007] hover:bg-[#ff6b1a]"
                        >
                          SAVE CHANGES
                        </ButtonComponent>
                        <ButtonComponent
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          CANCEL
                        </ButtonComponent>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-2xl">
                <h2 
                  className="uppercase-headline mb-6"
                  style={{ fontSize: '20px', letterSpacing: '0.1em', fontWeight: 600 }}
                >
                  ACCOUNT SETTINGS
                </h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="frosted-glass border border-white/30 rounded-sm p-6">
                    <h3 
                      className="uppercase-headline mb-4"
                      style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      CHANGE PASSWORD
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          CURRENT PASSWORD
                        </Label>
                        <Input 
                          id="currentPassword"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          NEW PASSWORD
                        </Label>
                        <Input 
                          id="newPassword"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="uppercase-headline mb-2" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          CONFIRM NEW PASSWORD
                        </Label>
                        <Input 
                          id="confirmPassword"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                      <button
                        className="w-full py-3 bg-[#D04007] text-white uppercase-headline transition-all duration-300 hover:bg-[#ff6b1a]"
                        style={{ fontSize: '11px', letterSpacing: '0.15em' }}
                      >
                        UPDATE PASSWORD
                      </button>
                    </div>
                  </div>

                  {/* Email Preferences */}
                  <div className="frosted-glass border border-white/30 rounded-sm p-6">
                    <h3 
                      className="uppercase-headline mb-4"
                      style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      EMAIL PREFERENCES
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-[#D04007]" />
                        <span style={{ fontSize: '12px' }}>New arrivals and product launches</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-[#D04007]" />
                        <span style={{ fontSize: '12px' }}>Exclusive offers and promotions</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="accent-[#D04007]" />
                        <span style={{ fontSize: '12px' }}>Order updates and shipping notifications</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="accent-[#D04007]" />
                        <span style={{ fontSize: '12px' }}>Style tips and fashion news</span>
                      </label>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="frosted-glass border border-red-200 rounded-sm p-6">
                    <h3 
                      className="uppercase-headline mb-2 text-red-600"
                      style={{ fontSize: '14px', letterSpacing: '0.1em', fontWeight: 600 }}
                    >
                      DANGER ZONE
                    </h3>
                    <p className="mb-4 opacity-70" style={{ fontSize: '12px' }}>
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors duration-300"
                          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                        >
                          DELETE ACCOUNT
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="frosted-glass border border-white/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="uppercase-headline" style={{ fontSize: '16px', letterSpacing: '0.1em' }}>
                            Delete Account
                          </AlertDialogTitle>
                          <AlertDialogDescription style={{ fontSize: '13px', lineHeight: 1.6 }}>
                            Are you sure you want to delete your account? This action cannot be undone. 
                            All your data, orders, and wishlist will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="uppercase-headline" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              toast.error('Account deleted', {
                                description: 'Your account has been removed'
                              });
                            }}
                            className="bg-red-500 hover:bg-red-600 uppercase-headline"
                            style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}