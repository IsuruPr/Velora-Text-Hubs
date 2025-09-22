import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name || '');
        setIsAdmin(userData.email === 'admin@example.com');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Home' },
      { path: '/store', label: 'Store' },
      { path: '/about', label: 'About' },
      { path: '/contact', label: 'Contact' },
    ];
    
    if (isAdmin) {
      baseLinks.push({ path: '/dashboard', label: 'Dashboard' });
    }
    
    return baseLinks;
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserDropdownOpen(false);
    toast.success('Successfully logged out');
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen || userDropdownOpen ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold tracking-tight">
            MODA
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-5">
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors focus:outline-none"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline text-sm font-medium">
                      {userName ? userName.split(' ')[0] : 'Account'}
                    </span>
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-panel rounded-md shadow-lg py-1 z-50">
                      {!isAdmin && (
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                        >
                          My Profile
                        </Link>
                      )}
                      {isAdmin ? (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                        >
                          Dashboard
                        </Link>
                      ) : null}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Log out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="text-foreground/80 hover:text-foreground transition-colors">
                  <User size={20} />
                </Link>
              )}
            </div>
            
            <Link to="/cart" className="relative text-foreground/80 hover:text-foreground transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel px-4 py-5 mt-3 mx-4 rounded-lg"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${isActive(link.path) ? 'text-primary' : 'text-foreground/80'}`}
                >
                  {link.label}
                </Link>
              ))}
              
              {isLoggedIn && (
                <>
                  {!isAdmin && (
                    <Link 
                      to="/profile" 
                      className={`text-lg font-medium ${isActive('/profile') ? 'text-primary' : 'text-foreground/80'}`}
                    >
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-lg font-medium text-red-500 text-left flex items-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    Log out
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
