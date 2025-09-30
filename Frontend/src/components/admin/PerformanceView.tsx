
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/services/api';
import { ChartContainer } from '@/components/ui/chart';

const PerformanceView = () => {
  // Fetch summary data for the dashboard
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: () => api.admin.getSummary(),
  });

  // Format data for category distribution pie chart
  const productCategoryData = useMemo(() => {
    if (!summaryData?.productsByCategory) return [];
    
    return Object.entries(summaryData.productsByCategory).map(([category, count]) => ({
      name: category,
      value: count,
    }));
  }, [summaryData?.productsByCategory]);

  // Format data for monthly orders bar chart
  const monthlyOrdersData = useMemo(() => {
    if (!summaryData?.monthlyOrders) return [];
    return summaryData.monthlyOrders;
  }, [summaryData?.monthlyOrders]);

  // Colors for charts
  const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#8B5CF6'];

  // Create summary cards
  const SummaryCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 bg-${color}-100`} style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-4 w-4`, 
            style: { color } 
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          Updated just now
        </p>
      </CardContent>
    </Card>
  );

  if (isLoadingSummary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner h-8 w-8 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  // Custom tooltip formatter for bar chart
  const CustomBarChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].payload.month}`}</p>
          <p className="text-sm">{`Orders: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip formatter for pie chart
  const CustomPieChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm">{`Count: ${payload[0].value}`}</p>
          <p className="text-xs text-muted-foreground">{`(${(payload[0].percent * 100).toFixed(0)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Users" 
          value={summaryData?.totalUsers || 0} 
          icon={<Users />} 
          color="#9b87f5" 
        />
        <SummaryCard 
          title="Total Products" 
          value={summaryData?.totalProducts || 0} 
          icon={<Package />} 
          color="#0EA5E9" 
        />
        <SummaryCard 
          title="Total Orders" 
          value={summaryData?.totalOrders || 0} 
          icon={<ShoppingCart />} 
          color="#F97316" 
        />
        <SummaryCard 
          title="Total Revenue" 
          value={`$${summaryData?.totalRevenue?.toFixed(2) || '0.00'}`} 
          icon={<TrendingUp />} 
          color="#8B5CF6" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Orders Bar Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                orders: {
                  theme: {
                    light: "#9b87f5",
                    dark: "#9b87f5",
                  },
                },
              }}
            >
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomBarChartTooltip />} />
                <Legend />
                <Bar dataKey="orders" fill="var(--color-orders)" name="Orders" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Product Categories Pie Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                category: {
                  color: "#9b87f5",
                },
              }}
            >
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieChartTooltip />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceView;
