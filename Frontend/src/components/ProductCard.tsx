
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="overflow-hidden">
        <AspectRatio ratio={1 / 1}>
          <img 
            src={product.image} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-foreground/70">{product.category}</p>
            <h3 className="font-medium mt-1 line-clamp-1">{product.name}</h3>
          </div>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button 
          className="w-full h-9" 
          size="sm"
          variant="secondary"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        
        <Button 
          size="sm"
          variant="outline"
          className="h-9 aspect-square p-0 flex-shrink-0" 
          onClick={handleViewDetails}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
