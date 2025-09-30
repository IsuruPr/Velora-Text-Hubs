
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-transition min-h-screen pt-24 pb-16">
      {/* Hero section */}
      <section className="relative mb-16">
        <div className="h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
            alt="About MODA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-lg p-8 sm:p-10 max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Our Story
              </motion.h1>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 mt-24">
        <motion.div 
          className="prose prose-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="lead text-xl text-foreground/80">
            Founded in 2010, MODA began with a simple vision: to create timeless clothing that combines exceptional design, premium materials, and meticulous craftsmanship.
          </p>
          
          <p>
            What started as a small boutique in New York has grown into an international brand known for its commitment to quality and attention to detail. Our philosophy has remained unchanged: we believe that clothing should be beautifully designed, ethically made, and built to last.
          </p>
          
          <p>
            Each MODA garment is the product of careful consideration—from the initial sketch to the final stitch. We source the finest materials from around the world and work with skilled artisans who share our passion for excellence.
          </p>
          
          <blockquote>
            "Fashion is not about labels. It's not about brands. It's about something else that comes from within you."
          </blockquote>
          
          <p>
            As we've grown, we've remained committed to responsible practices. We prioritize sustainable materials, ethical manufacturing, and transparent business operations. We believe that great fashion shouldn't come at the expense of our planet or its people.
          </p>
        </motion.div>
      </section>
      
      {/* Values */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Values</h2>
            <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
              The principles that guide everything we do at MODA.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Craftsmanship",
                description: "We believe in creating garments that are built to last, combining traditional techniques with modern innovation."
              },
              {
                title: "Sustainable Practices",
                description: "Every decision we make considers its impact on our planet, from material sourcing to manufacturing processes."
              },
              {
                title: "Timeless Design",
                description: "We focus on creating enduring styles that transcend trends and remain relevant season after season."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="glass-panel rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                <p className="text-foreground/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="section-container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Team</h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            The passionate individuals who bring MODA to life.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Elena Martinez",
              role: "Founder & Creative Director",
              image: "https://images.unsplash.com/photo-1561406636-b80293969660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
            },
            {
              name: "Marcus Chen",
              role: "Head of Design",
              image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
            },
            {
              name: "Sophie Williams",
              role: "Sustainability Lead",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
            },
            {
              name: "David Kim",
              role: "Production Manager",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
            }
          ].map((member, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-foreground/70 text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
