
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, LogIn, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  products: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        setIsLoggedIn(true);
        fetchOrders();
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.orders.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Status badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <LogIn className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">Sign in to view your orders</h2>
            <p className="text-foreground/70 mb-6">
              You need to log in to view your order history.
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center">
            <PackageOpen className="mr-3 h-8 w-8" /> Your Orders
          </h1>
          <div className="h-0.5 w-full bg-border/50 mb-8" />
        </motion.div>
        
        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <PackageOpen className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-foreground/70 mb-6">
              You haven't placed any orders yet.
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/store')}
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="glass-panel p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="text-sm text-foreground/70 mb-1">Order #{order._id.slice(-6)}</div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium">{formatDate(order.createdAt)}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <div className="text-sm text-foreground/70">Total Amount</div>
                    <div className="text-lg font-medium">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.products.map((item) => (
                      <div key={item.product._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 h-12 w-12 rounded-md overflow-hidden">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-foreground/70">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-border/50 pt-4 mt-4">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <address className="text-sm text-foreground/70 not-italic">
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </address>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <button
                    onClick={() => navigate('/store')}
                    className="text-primary text-sm hover:text-primary/80 flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderHistory;
