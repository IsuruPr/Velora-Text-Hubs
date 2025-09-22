
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold tracking-tight">
              MODA
            </Link>
            <p className="mt-4 text-sm text-foreground/70 max-w-xs">
              Premium clothing designed with attention to detail and commitment to quality.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/store?category=men" className="text-foreground/70 hover:text-foreground text-sm">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/store?category=women" className="text-foreground/70 hover:text-foreground text-sm">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-foreground/70 hover:text-foreground text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-foreground/70 hover:text-foreground text-sm">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-foreground text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/70 hover:text-foreground text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Customer Service</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  Store Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-foreground text-sm">
                  Payment Methods
                </a>
              </li>
              <li className="pt-2">
                <Link to="/quotation">
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Get a Quotation
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/20">
          <p className="text-sm text-foreground/60 text-center">
            &copy; {new Date().getFullYear()} MODA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
