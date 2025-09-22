import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const userFromStorage = localStorage.getItem('user');
      
      if (!userFromStorage) {
        toast({
          title: 'Not logged in',
          description: 'Please log in to view your profile',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast({
          title: 'Error',
          description: 'Something went wrong with your profile',
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Refresh the entire page to reset all application state
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading profile...</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center">
            <User className="mr-3 h-8 w-8" /> My Profile
          </h1>
          <div className="h-0.5 w-full bg-border/50 mb-8" />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="glass-panel p-6 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{userData?.name}</h2>
                <p className="text-foreground/70">{userData?.email}</p>
                
                <button
                  onClick={handleLogout}
                  className="mt-6 flex items-center text-red-500 hover:text-red-600 text-sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Navigation Panels */}
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Orders Panel */}
            <div className="glass-panel p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Your Orders</h2>
              </div>
              <p className="mb-4 text-foreground/70">
                View your order history and track current orders.
              </p>
              <Link 
                to="/orders" 
                className="btn-secondary w-full justify-center"
              >
                View Orders
              </Link>
            </div>
            
            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <p className="mb-4 text-foreground/70">
                Check your recent store activity and browsing history.
              </p>
              <div className="border-t border-border/50 pt-4">
                <div className="text-center text-foreground/60 py-4">
                  Your recent activity will appear here
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
