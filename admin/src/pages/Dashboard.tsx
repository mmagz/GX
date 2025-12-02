import { memo, useState } from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign, Eye, Clock, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAdmin } from "../contexts/AdminContext";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = memo(function Dashboard({ onNavigate }: DashboardProps) {
  const { orders, products, capsules, loading, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState('new');

  // Calculate stats - exclude cancelled orders
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Filter out cancelled orders for all calculations
  const activeOrders = orders.filter(order => order.status !== 'Cancelled');
  
  const newOrders = activeOrders.filter(order => 
    order.status === 'Order Placed' || order.status === 'Processing'
  );
  const confirmedOrders = activeOrders.filter(order => 
    order.status === 'Confirmed' || order.status === 'Shipped'
  );
  const completedOrders = activeOrders.filter(order => 
    order.status === 'Delivered'
  );
  
  const thisMonthOrders = activeOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  
  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Order Placed': { color: 'bg-green-100 text-green-700', label: 'Order Placed' },
      'Confirmed': { color: 'bg-yellow-100 text-yellow-700', label: 'Confirmed' },
      'Processing': { color: 'bg-orange-100 text-orange-700', label: 'Processing' },
      'Shipped': { color: 'bg-gray-100 text-black', label: 'Shipped' },
      'Delivered': { color: 'bg-green-100 text-green-700', label: 'Delivered' },
      'Cancelled': { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    
    const variant = variants[status] || variants['Order Placed'];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[#262930] text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-[#404040] mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040]">New Orders</p>
                <p className="text-2xl font-bold text-[#262930]">{newOrders.length}</p>
                <p className="text-xs text-[#404040]">Unattended orders</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040]">Total Orders</p>
                <p className="text-2xl font-bold text-[#262930]">{activeOrders.length}</p>
                <p className="text-xs text-[#404040]">This month: {thisMonthOrders.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040]">This Month Revenue</p>
                <p className="text-2xl font-bold text-[#262930]">₹{thisMonthRevenue.toLocaleString()}</p>
                <p className="text-xs text-[#404040]">Current month</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040]">Total Revenue</p>
                <p className="text-2xl font-bold text-[#262930]">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-[#404040]">All time</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Orders Section */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#262930]">New Orders</CardTitle>
            <Button 
              onClick={() => onNavigate('orders')}
              className="bg-[#A00000] hover:bg-[#800000] text-white"
            >
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-[#404040]" />
              <p className="text-[#404040]">No new orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#A00000] text-white flex items-center justify-center text-sm font-bold">
                      #{order.orderNumber?.slice(-4) || '0000'}
                    </div>
                    <div>
                      <p className="text-sm text-[#262930] font-medium">
                        {order.orderNumber || `Order ${order._id.slice(-8)}`}
                      </p>
                      <p className="text-xs text-[#404040]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[#404040]">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-[#262930] font-medium">
                        ₹{order.total?.toLocaleString() || '0'}
                      </p>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(order._id, 'Confirmed')}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});