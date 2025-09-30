
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, isLoggedIn } = useCart();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate tax and total
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <main className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center">
            <ShoppingBag className="mr-3 h-8 w-8" /> Your Cart
          </h1>
          <div className="h-0.5 w-full bg-border/50 mb-8" />
        </motion.div>
        
        {!isLoggedIn && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <LogIn className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">Sign in to view your cart</h2>
            <p className="text-foreground/70 mb-6">
              You need to log in to add items to your cart and complete purchases.
            </p>
            <Link to="/login" className="btn-primary">
              Log In
            </Link>
          </motion.div>
        )}
        
        {isLoggedIn && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className="flex flex-col sm:flex-row bg-white/80 rounded-lg p-4 border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                  >
                    <div className="sm:w-24 sm:h-24 h-36 w-full mb-4 sm:mb-0 sm:mr-6">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium">{item.name}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{item.category}</p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 px-2 text-foreground/70 hover:text-foreground disabled:opacity-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-foreground/70 hover:text-foreground"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-foreground/70 hover:text-foreground flex items-center text-sm"
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-foreground/70 hover:text-foreground text-sm flex items-center"
                >
                  <Trash2 size={16} className="mr-1" /> Clear Cart
                </button>
                <Link to="/store" className="text-primary text-sm flex items-center hover:text-primary/80">
                  <ArrowLeft size={16} className="mr-1" /> Continue Shopping
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="glass-panel rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link to="/checkout" className="btn-primary w-full block text-center">
                  Proceed to Checkout
                </Link>
                
                <p className="mt-4 text-xs text-foreground/70 text-center">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          isLoggedIn && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ShoppingBag className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-foreground/70 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/store" className="btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          )
        )}
      </div>
    </main>
  );
};

export default Cart;
