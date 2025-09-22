
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
import { api } from '@/services/api';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  /*const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);*/ 
  const [isLoading, setIsLoading] = useState(true);
  /*const [search, setSearch] = useState('');*/ 
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await api.admin.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
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
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

/* Handle delete
  const handleDelete = async (orderId: string) => {
    try {
      await api.admin.deleteOrder(orderId);
      const newOrders = orders.filter(o => o._id !== orderId);
      setOrders(newOrders);
      setFilteredOrders(newOrders);
      toast({ title: 'Success', description: 'Order deleted successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete order', variant: 'destructive' });
    }
  };*/

  /*const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = orders.filter(o =>
      o.user.name.toLowerCase().includes(value.toLowerCase()) ||
      o.user.email.toLowerCase().includes(value.toLowerCase()) ||
      o._id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };*/

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Management</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/30">
          No orders found
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    {order._id.slice(-6)}
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
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
