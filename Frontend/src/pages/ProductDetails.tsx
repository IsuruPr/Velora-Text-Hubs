
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, Shield, ArrowLeft, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inventory: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
        document.title = `${data.name} - MODA`;
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
    
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      }, quantity);
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.inventory) {
      setQuantity(quantity + 1);
    } else {
      toast.error('Cannot exceed available inventory');
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);    
    }
  };
  
  if (loading) { 
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-foreground/70 mb-6">{error || "This product doesn't exist or has been removed."}</p>
        <Button onClick={() => navigate('/store')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Button>
      </div>
    );
  }
  
  return (
    <main className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-lg overflow-hidden"
          >
            <AspectRatio ratio={1 / 1}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block text-sm font-medium text-muted-foreground mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.inventory < 5 && product.inventory > 0 && (
                <span className="ml-4 text-sm text-amber-500 font-medium">
                  Only {product.inventory} left
                </span>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
              
              <div className="flex items-center">
                <label htmlFor="quantity" className="block text-sm font-medium mr-4">
                  Quantity:
                </label>
                <div className="flex items-center border border-input rounded-md">
                  <button 
                    type="button" 
                    className="px-3 py-1 text-foreground/70 hover:text-foreground"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button 
                    type="button" 
                    className="px-3 py-1 text-foreground/70 hover:text-foreground"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
                <span className="ml-4 text-sm text-foreground/70">
                  {product.inventory} available
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleAddToCart} 
                  variant="outline" 
                  className="flex-1"
                  disabled={!isLoggedIn || product.inventory === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow} 
                  className="flex-1"
                  disabled={!isLoggedIn || product.inventory === 0}
                >
                  Buy Now
                </Button>
              </div>
              
              {!isLoggedIn && (
                <div className="text-sm text-amber-500">
                  Please log in to add items to cart
                </div>
              )}
              
              {product.inventory === 0 && (
                <div className="text-sm text-red-500">
                  This product is currently out of stock
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="font-medium">Product Details</h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex items-start">
                  <BadgeCheck className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Premium quality material</span>
                </li>
                <li className="flex items-start">
                  <Truck className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Fast shipping available</span>
                </li>
                <li className="flex items-start">
                  <Shield className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;

