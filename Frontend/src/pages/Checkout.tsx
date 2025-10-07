
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { api } from '@/services/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

const Checkout: React.FC = () => {
  const { cartItems, clearCart, subtotal, isLoggedIn } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Calculate tax and total
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  // Setup form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // Check if user is logged in and has items in cart
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to checkout');
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    window.scrollTo(0, 0);
  }, [isLoggedIn, cartItems.length, navigate]);

  // Submit order to API
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert cart items to order format
      const orderProducts = cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity
      }));
      
      // Create the order with the API
      await api.orders.create({
        products: orderProducts,
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country
        }
      });
      
      // Order created successfully
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully!');
      
      // After 2 seconds, redirect to the profile page
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof Error) {
        toast.error(`Failed to create order: ${error.message}`);
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show completion screen if order is complete
  if (orderComplete) {
    return (
      <motion.div 
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          >
            <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. You will receive a confirmation soon.
          </p>
          
          <Button 
            onClick={() => navigate('/profile')} 
            className="w-full"
          >
            View Your Orders
          </Button>
        </div>
      </motion.div>
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
            <ShoppingBag className="mr-3 h-8 w-8" /> Checkout
          </h1>
          <div className="h-0.5 w-full bg-border/50 mb-8" />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="glass-panel p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-6 flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Shipping Information
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h2 className="text-xl font-medium mb-6 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" /> Payment Method
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a demo store. No real payment will be processed.
                    </p>
                    <div className="p-4 border border-border rounded-md bg-secondary/10">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-primary/80 flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="ml-2 font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="glass-panel rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                By placing an order, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
