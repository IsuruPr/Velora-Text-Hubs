
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemManagement from '@/components/admin/ItemManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import PerformanceView from '@/components/admin/PerformanceView';
import QuotationManagement from '@/components/admin/QuotationManagement';
import SupplierManagement from '@/components/admin/SupplierManagement';
import api from '@/services/api';

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Dashboard: No auth token found');
          toast({
            title: 'Access Denied',
            description: 'Please log in to continue',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }
        
        // Get user profile to verify admin status
        const user = localStorage.getItem('user');
        let userData;
        
        try {
          userData = user ? JSON.parse(user) : null;
        } catch (error) {
          console.error('Error parsing user data:', error);
          userData = null;
        }
        
        console.log('Dashboard: Checking admin status for user:', userData?.email);
        
        if (!userData || userData.email !== 'admin@example.com') {
          console.log('Dashboard: User is not admin:', userData?.email);
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the dashboard',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        // Try to fetch users as a test for admin access
        try {
          await api.admin.getUsers();
          setIsAdmin(true);
          console.log('Dashboard: Admin access confirmed');
        } catch (error) {
          console.error('Dashboard: Failed admin check:', error);
          toast({
            title: 'Authentication Error',
            description: 'Your session may have expired. Please log in again.',
            variant: 'destructive',
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Error',
          description: 'Failed to verify permissions',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);

  // Show loading or no access if not admin
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Checking permissions...</h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
          <p className="mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="glass-panel p-6 rounded-lg">
            <PerformanceView />
          </TabsContent>
          
          <TabsContent value="products" className="glass-panel p-6 rounded-lg">
            <ItemManagement />
          </TabsContent>
          
          <TabsContent value="orders" className="glass-panel p-6 rounded-lg">
            <OrderManagement />
          </TabsContent>
          
          <TabsContent value="customers" className="glass-panel p-6 rounded-lg">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="quotations" className="glass-panel p-6 rounded-lg">
            <QuotationManagement />
          </TabsContent>
          
          <TabsContent value="suppliers" className="glass-panel p-6 rounded-lg">
            <SupplierManagement />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Dashboard;
