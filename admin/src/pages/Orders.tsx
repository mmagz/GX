import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, Truck, Package, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { OrderDetailsDrawer } from "../components/OrderDetailsDrawer";
import { useAdmin } from "../contexts/AdminContext";
import { toast } from "sonner@2.0.3";

export function Orders() {
  const { orders, loading, updateOrderStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter orders by status - exclude cancelled orders
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
  const cancelledOrders = orders.filter(order => 
    order.status === 'Cancelled'
  );

  const filterOrdersBySearch = (orderList: any[]) => {
    return orderList.filter(order => {
      const customerName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`;
      const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.address?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.userId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 'text-green-600';
      case 'Confirmed':
        return 'text-yellow-600';
      case 'Processing':
        return 'text-orange-500';
      case 'Shipped':
        return 'text-black';
      case 'Delivered':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const OrderTable = ({ orderList, emptyMessage }: { orderList: any[], emptyMessage: string }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status & Amount</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D04007]"></div>
                  <span className="ml-2">Loading orders...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filterOrdersBySearch(orderList).length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20">
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-[#404040] text-lg">
                    {emptyMessage}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filterOrdersBySearch(orderList).map((order) => (
              <TableRow key={order._id}>
                <TableCell className="text-[#262930]">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-[#262930]">
                      {order.address?.firstName} {order.address?.lastName}
                    </p>
                    <p className="text-xs text-[#404040]">{order.address?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-[#262930]">
                      {order.items?.length || order.orderItems?.length || 0} item{(order.items?.length || order.orderItems?.length || 0) > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-[#404040] truncate max-w-[200px]">
                      {order.items?.[0]?.name || order.orderItems?.[0]?.productName}
                      {(order.items?.length || order.orderItems?.length || 0) > 1 && ` +${(order.items?.length || order.orderItems?.length || 0) - 1} more`}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-[#262930]">
                      ₹{order.total?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value: string) => handleStatusChange(order._id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Order Placed">Order Placed</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-[#404040]">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#262930] text-2xl font-bold">Order Management</h2>
        <p className="text-sm text-[#404040] mt-1">
          Track and manage customer orders
        </p>
      </div>

      {/* Search Filter */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#404040]" />
              <Input
                placeholder="Search by order ID, customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Sub Navigation */}
             <div className="bg-[#F5F3F0] border border-gray-200 rounded-lg shadow-sm">
        <Tabs defaultValue="new" className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="w-full h-auto bg-transparent p-0 grid grid-cols-4">
              <TabsTrigger 
                value="new" 
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#A00000] data-[state=active]:bg-[#f0ece7] data-[state=active]:text-[#A00000] data-[state=active]:shadow-[inset_0_-3px_0_0_#A00000] hover:bg-gray-50"
              >
                <Package className="w-4 h-4" />
                <span className="font-medium">NEW ORDERS</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {newOrders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="confirmed" 
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#A00000] data-[state=active]:bg-[#f0ece7] data-[state=active]:text-[#A00000] data-[state=active]:shadow-[inset_0_-3px_0_0_#A00000] hover:bg-gray-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">CONFIRMED</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {confirmedOrders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#A00000] data-[state=active]:bg-[#f0ece7] data-[state=active]:text-[#A00000] data-[state=active]:shadow-[inset_0_-3px_0_0_#A00000] hover:bg-gray-50"
              >
                <Truck className="w-4 h-4" />
                <span className="font-medium">COMPLETED</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {completedOrders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#A00000] data-[state=active]:bg-[#f0ece7] data-[state=active]:text-[#A00000] data-[state=active]:shadow-[inset_0_-3px_0_0_#A00000] hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                <span className="font-medium">CANCELLED</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {cancelledOrders.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new" className="p-6 min-h-[600px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#262930]">
                New Orders ({filterOrdersBySearch(newOrders).length})
              </h3>
              <p className="text-sm text-[#404040]">
                Orders that need immediate attention
              </p>
            </div>
            <div className="min-h-[500px] w-full">
              <OrderTable 
                orderList={newOrders} 
                emptyMessage="No new orders found"
              />
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="p-6 min-h-[600px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#262930]">
                Confirmed Orders ({filterOrdersBySearch(confirmedOrders).length})
              </h3>
              <p className="text-sm text-[#404040]">
                Orders that have been confirmed and are being processed
              </p>
            </div>
            <div className="min-h-[500px] w-full">
              <OrderTable 
                orderList={confirmedOrders} 
                emptyMessage="No confirmed orders found"
              />
            </div>
          </TabsContent>

          <TabsContent value="completed" className="p-6 min-h-[600px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#262930]">
                Completed Orders ({filterOrdersBySearch(completedOrders).length})
              </h3>
              <p className="text-sm text-[#404040]">
                Orders that have been delivered successfully
              </p>
            </div>
            <div className="min-h-[500px] w-full">
              <OrderTable 
                orderList={completedOrders} 
                emptyMessage="No completed orders found"
              />
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="p-6 min-h-[600px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#262930]">
                Cancelled Orders ({filterOrdersBySearch(cancelledOrders).length})
              </h3>
              <p className="text-sm text-[#404040]">
                Orders that have been cancelled - stock has been restored
              </p>
            </div>
            <div className="min-h-[500px] w-full">
              <OrderTable 
                orderList={cancelledOrders} 
                emptyMessage="No cancelled orders found"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}