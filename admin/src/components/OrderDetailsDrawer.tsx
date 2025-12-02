import { Package, CreditCard, MapPin, User, CheckCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items?: OrderItem[];
  orderItems?: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsDrawer({ open, onClose, order }: OrderDetailsDrawerProps) {
  if (!order) return null;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Confirmed':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Processing':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'Shipped':
        return 'bg-gray-100 text-black hover:bg-gray-100';
      case 'Delivered':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  // Progress bar logic
  const getProgressSteps = () => {
    const steps = [
      { name: 'Order Placed', status: 'Order Placed' },
      { name: 'Order Confirmed', status: 'Confirmed' },
      { name: 'Shipped', status: 'Shipped' },
      { name: 'Delivered', status: 'Delivered' }
    ];

    const currentStatus = order.status;
    let currentStepIndex = -1;

    // Find current step index
    if (currentStatus === 'Order Placed' || currentStatus === 'Processing') {
      currentStepIndex = 0;
    } else if (currentStatus === 'Confirmed') {
      currentStepIndex = 1;
    } else if (currentStatus === 'Shipped') {
      currentStepIndex = 2;
    } else if (currentStatus === 'Delivered') {
      currentStepIndex = 3;
    } else if (currentStatus === 'Cancelled') {
      currentStepIndex = -1; // Cancelled orders don't show progress
    }

    return { steps, currentStepIndex };
  };

  const { steps, currentStepIndex } = getProgressSteps();
  const progressPercentage = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
             <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-[#F5F3F0]">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-[#262930]">
            Order Details
          </SheetTitle>
          <SheetDescription className="text-[#404040]">
            {order.orderNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Order Progress Bar */}
          {currentStepIndex >= 0 && (
            <div className="space-y-4">
              <h3 className="text-[#262930] font-semibold">Order Progress</h3>
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          index <= currentStepIndex 
                            ? 'bg-[#A00000] border-[#A00000] text-white' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {index <= currentStepIndex ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 text-center ${
                          index <= currentStepIndex ? 'text-[#A00000] font-medium' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                    <div 
                      className="h-full bg-[#A00000] transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-[#404040]">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status Cards */}
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-[#F8F8F8] rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Package className="w-5 h-5 text-[#262930]" />
                </div>
                <div>
                  <p className="text-xs text-[#404040] mb-1">Order Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between p-4 bg-[#F8F8F8] rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <CreditCard className="w-5 h-5 text-[#262930]" />
                </div>
                <div>
                  <p className="text-xs text-[#404040] mb-1">Payment Status</p>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Customer Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#A00000]" />
              <h3 className="text-[#262930]">Customer Information</h3>
            </div>
            <div className="space-y-3 pl-7">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#404040]">Name</span>
                <span className="text-sm text-[#262930]">
                  {order.address.firstName} {order.address.lastName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#404040]">Email</span>
                <span className="text-sm text-[#262930]">{order.address.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#404040]">Phone</span>
                <span className="text-sm text-[#262930]">{order.address.phone}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Shipping Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#CC5500]" />
              <h3 className="text-[#262930]">Shipping Address</h3>
            </div>
            <div className="pl-7">
              <p className="text-sm text-[#262930] leading-relaxed">
                {order.address.address}
                {order.address.apartment && `, ${order.address.apartment}`}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
                <br />
                {order.address.country}
              </p>
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#404040]" />
              <h3 className="text-[#262930]">Order Items</h3>
            </div>
            <div className="space-y-3">
              {(order.items || order.orderItems || []).map((item, index) => (
                <div 
                  key={index}
                  className="p-4 bg-[#F8F8F8] rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-[#262930]">
                        {item.productName || item.name}
                      </p>
                      <p className="text-xs text-[#404040] mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#262930]">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-[#404040]">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-[#262930]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Order Summary */}
          <div className="space-y-3 p-4 bg-[#F8F8F8] rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#404040]">Subtotal</span>
              <span className="text-sm text-[#262930]">
                ₹{order.subtotal?.toFixed(2) || order.total?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#404040]">Shipping</span>
              <span className="text-sm text-[#262930]">
                ₹{order.shipping?.toFixed(2) || '0.00'}
              </span>
            </div>
            {order.tax && order.tax > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#404040]">Tax</span>
                <span className="text-sm text-[#262930]">
                  ₹{order.tax.toFixed(2)}
                </span>
              </div>
            )}
            <Separator className="bg-[#E5E5E5]" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[#262930]">Total</span>
              <span className="text-lg text-[#A00000]">
                ₹{order.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Order Date */}
          <div className="pt-2 pb-6">
            <div className="text-xs text-[#404040] text-center">
              Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

