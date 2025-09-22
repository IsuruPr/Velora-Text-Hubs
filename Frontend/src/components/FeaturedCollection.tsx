
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Sample featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'Tailored Cotton Shirt',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
    category: 'Men',
  },
  {
    id: '2',
    name: 'Wool Blend Coat',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80',
    category: 'Women',
  },
  {
    id: '3',
    name: 'Classic Denim Jacket',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Men',
  },
  {
    id: '4',
    name: 'Silk Blouse',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1552874869-5c39ec9288dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
    category: 'Women',
  },
];

interface FeaturedCollectionProps {
  title: string;
  subtitle?: string;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ title, subtitle }) => {
  return (
    <section className="section-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              className="mt-3 text-lg text-foreground/75 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Link to="/store" className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors mt-4 md:mt-0">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;
