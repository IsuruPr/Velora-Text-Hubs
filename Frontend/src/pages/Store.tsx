import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  inventory?: number;
}

const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const categoryParam = searchParams.get('category');
      try {
        let queryString = '';
        if (categoryParam && categoryParam !== 'all') {
          queryString = `?category=${categoryParam.toLowerCase()}`;
        }
        
        const response = await fetch(`http://localhost:5000/api/products${queryString}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        
        if (categoryParam) {
          setCategory(categoryParam.toLowerCase());
        } else {
          setCategory('all');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
      
      window.scrollTo(0, 0);
    };
    
    fetchProducts();
  }, [searchParams]);
  
  const updateCategory = (newCategory: string) => {
    if (newCategory === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  return (
    <main className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Shop Collection
            </h1>
            <p className="mt-2 text-foreground/70">
              {loading ? 'Loading products...' : `${products.length} products available`}
            </p>
          </motion.div>
          
          <button
            className="mt-4 md:mt-0 flex items-center text-sm font-medium py-2 px-3 border border-border rounded-md md:hidden"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={16} className="mr-2" />
            {filterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <motion.aside
            className={`w-full md:w-64 md:block ${filterOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="sticky top-24 glass-panel rounded-lg p-5">
              <div className="flex items-center mb-4">
                <Filter size={18} className="mr-2" />
                <h2 className="font-medium">Filters</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-all"
                      name="category"
                      checked={category === 'all'}
                      onChange={() => updateCategory('all')}
                      className="h-4 w-4 text-primary focus:ring-primary/50 border-muted-foreground/30"
                    />
                    <label htmlFor="category-all" className="ml-2 text-sm">
                      All
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-men"
                      name="category"
                      checked={category === 'men'}
                      onChange={() => updateCategory('men')}
                      className="h-4 w-4 text-primary focus:ring-primary/50 border-muted-foreground/30"
                    />
                    <label htmlFor="category-men" className="ml-2 text-sm">
                      Men
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="category-women"
                      name="category"
                      checked={category === 'women'}
                      onChange={() => updateCategory('women')}
                      className="h-4 w-4 text-primary focus:ring-primary/50 border-muted-foreground/30"
                    />
                    <label htmlFor="category-women" className="ml-2 text-sm">
                      Women
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-foreground/70">{error}</p>
                <button 
                  className="mt-4 btn-secondary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-foreground/70">No products found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Store;
