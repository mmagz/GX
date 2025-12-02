import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockStats, mockOrdersOverTime, mockSalesByCapsule, mockTopProducts } from "../utils/mockData";

const COLORS = ['#A00000', '#CC5500', '#404040', '#262930', '#EAE7E2'];

export function Analytics() {
  const topProductsData = mockTopProducts.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    revenue: p.revenue
  }));

  const capsuleDistribution = mockSalesByCapsule.map(c => ({
    name: c.name,
    value: c.sales
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[#262930] dark:text-white">Analytics & Reports</h2>
        <p className="text-sm text-[#404040] dark:text-gray-400 mt-1">
          Track business performance and sales metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040] dark:text-gray-400">Total Revenue</p>
                <p className="text-[#262930] dark:text-white mt-1">
                  ${mockStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2">All time</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#A00000]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#A00000]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040] dark:text-gray-400">Monthly Revenue</p>
                <p className="text-[#262930] dark:text-white mt-1">
                  ${mockStats.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2">+{mockStats.revenueGrowth}% this month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#CC5500]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#CC5500]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040] dark:text-gray-400">Total Orders</p>
                <p className="text-[#262930] dark:text-white mt-1">
                  {mockStats.totalOrders}
                </p>
                <p className="text-xs text-green-600 mt-2">+{mockStats.ordersGrowth}% increase</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#404040]/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-[#404040]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#404040] dark:text-gray-400">Avg. Order Value</p>
                <p className="text-[#262930] dark:text-white mt-1">
                  ${(mockStats.monthlyRevenue / mockStats.totalOrders * 12).toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-2">Per order</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#262930]/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-[#262930]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Trend */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardHeader>
          <CardTitle className="text-[#262930] dark:text-white">Revenue & Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockOrdersOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE7E2" />
              <XAxis dataKey="month" stroke="#404040" />
              <YAxis yAxisId="left" stroke="#404040" />
              <YAxis yAxisId="right" orientation="right" stroke="#404040" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #EAE7E2',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#A00000" 
                strokeWidth={3}
                name="Revenue ($)"
                dot={{ fill: '#A00000', r: 5 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#CC5500" 
                strokeWidth={3}
                name="Orders"
                dot={{ fill: '#CC5500', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue */}
        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardHeader>
            <CardTitle className="text-[#262930] dark:text-white">Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE7E2" />
                <XAxis type="number" stroke="#404040" />
                <YAxis dataKey="name" type="category" stroke="#404040" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #EAE7E2',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#A00000" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Capsule Distribution */}
        <Card className="border-0 shadow-sm bg-[#F5F3F0]">
          <CardHeader>
            <CardTitle className="text-[#262930] dark:text-white">Sales Distribution by Capsule</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={capsuleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {capsuleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #EAE7E2',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Capsule Performance Table */}
      <Card className="border-0 shadow-sm bg-[#F5F3F0]">
        <CardHeader>
          <CardTitle className="text-[#262930] dark:text-white">Capsule Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSalesByCapsule.map((capsule, index) => (
              <div key={capsule.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-[#262930] dark:text-white">{capsule.name}</span>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-[#404040] dark:text-gray-400">
                      {capsule.orders} orders
                    </span>
                    <span className="text-[#262930] dark:text-white">
                      ${capsule.sales.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#EAE7E2] dark:bg-[#262930] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(capsule.sales / Math.max(...mockSalesByCapsule.map(c => c.sales))) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
