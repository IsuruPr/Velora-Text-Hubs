
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  size?: string;
  color?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoggedIn: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in and get user ID
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        try {
          const userData = JSON.parse(user);
          setUserId(userData.id);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUserId(null);
          setIsLoggedIn(false);
        }
      } else {
        setUserId(null);
        setIsLoggedIn(false);
      }
    };
    
    // Check login status immediately and set up storage event listener
    checkLoginStatus();
    
    // Listen for storage events (for when the user logs in/out in another tab)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load cart from localStorage on initial render and when userId changes
  useEffect(() => {
    if (userId) {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      // For non-logged in users, clear the cart
      setCartItems([]);
    }
  }, [userId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (userId && cartItems.length > 0) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    } else if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    
    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setSubtotal(cartSubtotal);
  }, [cartItems, userId]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to cart');
      return;
    }

    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success('Item quantity updated in cart');
        return updatedItems;
      } else {
        // Add new item to cart
        toast.success('Item added to cart');
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    if (!isLoggedIn) return;

    setCartItems(prevItems => {
      const updatedCart = prevItems.filter(item => item.id !== productId);
      toast.success('Item removed from cart');
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!isLoggedIn) return;
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (!isLoggedIn) return;

    setCartItems([]);
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isLoggedIn
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
