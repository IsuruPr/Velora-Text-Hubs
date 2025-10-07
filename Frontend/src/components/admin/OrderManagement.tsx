import React, { useEffect, useState } from 'react'; 
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/alert-dialog';
import { Trash2, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: string;
  createdAt: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: 'Authentication Error',
            description: 'Please log in to continue',
            variant: 'destructive',
            duration: 4000,
          });
          return;
        }
        const data = await api.admin.getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to load orders: ${error.message}`,
          variant: 'destructive',
          duration: 4000,
        });
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, status);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status } : order
      ));
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
        variant: 'default',
        duration: 4000,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await api.orders.delete(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
        variant: 'default',
        duration: 4000,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  // ✅ Generate PDF Report with Left-Aligned Company Address
  const handleGeneratePDF = () => {
    const filteredOrders = getFilteredOrders();
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Company Orders Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
              .company-info { text-align: left; font-size: 14px; }
              .report-title { text-align: center; flex-grow: 1; }
              .report-title h1 { margin: 0; font-size: 24px; }
              .report-title h2 { margin: 5px 0; font-size: 18px; font-weight: normal; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
              th { background-color: #f0f0f0; }
            </style>
          </head>
          <body>
            <header>
              <div class="company-info">
                <p>Velora Textile</p>
                <p>123 Fashion Avenue,</p>
                <p>United States</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: support@modaclothing.com</p>
              </div>
              <div class="report-title">
                <h1>Orders Report</h1>
                <h2>Date: ${new Date().toLocaleDateString()}</h2>
              </div>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Products</th>
                  <th>Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.map(order => `
                  <tr>
                    <td>${order._id.slice(-8)}</td>
                    <td>${order.user?.name || 'Unknown'}</td>
                    <td>${order.user?.email || ''}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>${order.products.map(p => `${p.product?.name} (x${p.quantity})`).join(', ')}</td>
                    <td>
                      ${order.shippingAddress.address}, ${order.shippingAddress.city}, 
                      ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px;">
              &copy; ${new Date().getFullYear()} Velora Textile. All rights reserved.
            </footer>
          </body>
        </html>
      `);
      reportWindow.document.close();
      reportWindow.print();
    }
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const filteredOrders = getFilteredOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Order Management</h2>
        <div className="flex gap-3 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px]"
          />
          <Button variant="outline" onClick={handleGeneratePDF} className="flex gap-2">
            <FileDown className="h-4 w-4" /> Report
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/30">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No orders found</p>
            <p className="text-sm">Try adjusting your filters or search</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono">#{order._id.slice(-8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user?.name || 'Unknown User'}</div>
                      <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-semibold">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {order.products.length} item(s)
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.products.map((p, i) => (
                        <div key={i}>
                          {p.product?.name} (×{p.quantity})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Only Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order #{order._id.slice(-8)}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOrder(order._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
