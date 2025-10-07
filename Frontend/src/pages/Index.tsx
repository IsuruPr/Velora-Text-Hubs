
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeaturedCollection from '../components/FeaturedCollection';

const Index: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-transition min-h-screen">
      <Hero />
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-20 bg-secondary/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-medium"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            Designed for comfort. Crafted for style.
          </motion.h2>
          <motion.div 
            className="mt-4 text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p>Discover our meticulously crafted collection of premium clothing.</p>
          </motion.div>
        </div>
      </motion.section>
      
      <FeaturedCollection 
        title="Featured Collection" 
        subtitle="Discover our most popular styles, hand-picked for their exceptional design and quality."
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
              alt="Men's Collection" 
              className="rounded-lg h-full w-full object-cover"
            />
          </motion.div>
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-sm font-medium text-primary/80 mb-3">Men's Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Designed for the Modern Man
            </h2>
            <p className="text-foreground/70 mb-6">
              Our men's collection combines sophisticated style with maximum comfort. From casual essentials to formal attire, discover pieces that effortlessly elevate your wardrobe.
            </p>
            <div>
              <a href="/store?category=men" className="btn-primary">
                Shop Men's Collection
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <motion.div 
            className="flex flex-col justify-center order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-primary/80 mb-3">Women's Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Elegance in Every Detail
            </h2>
            <p className="text-foreground/70 mb-6">
              Our women's collection celebrates individuality and confidence. From timeless classics to contemporary trends, find pieces crafted with precision and care.
            </p>
            <div>
              <a href="/store?category=women" className="btn-primary">
                Shop Women's Collection
              </a>
            </div>
          </motion.div>
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Women's Collection" 
              className="rounded-lg h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;
