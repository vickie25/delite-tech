import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SignInModal from './auth/SignInModal';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Header: React.FC = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { isAuthenticated } = useCustomerAuth();
  const { scrollY } = useScroll();

  const headerPadding = useTransform(scrollY, [0, 50], ["24px", "12px"]);
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(250, 250, 249, 0)", "rgba(255, 255, 255, 0.7)"]
  );

  return (
    <>
      <motion.header
        style={{ 
          paddingTop: headerPadding, 
          paddingBottom: headerPadding,
          backgroundColor: headerBg
        }}
        className="fixed top-0 z-[90] w-full transition-all duration-500 backdrop-blur-md border-b border-transparent data-[scrolled=true]:border-white/20 data-[scrolled=true]:shadow-glass"
        data-scrolled={window.scrollY > 20}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
            >
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </motion.div>
            <span className="font-bodoni text-2xl font-bold tracking-tight text-primary">
              DELIGHT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {['Store', 'Mac', 'iPhone', 'Accessories'].map((item) => (
              <Link 
                key={item} 
                to={`/category/${item.toLowerCase()}`}
                className="font-jost text-[14px] font-medium text-secondary hover:text-cta transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cta transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-3 text-secondary hover:text-primary hover:bg-white/50 rounded-full transition-all">
              <Search className="w-5 h-5" />
            </button>
            
            <Link to="/cart" className="p-3 text-secondary hover:text-primary hover:bg-white/50 rounded-full transition-all relative">
              <ShoppingCart className="w-5 h-5" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-4 h-4 bg-cta text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                2
              </motion.span>
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="p-3 text-secondary hover:text-primary hover:bg-white/50 rounded-full transition-all">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <button 
                onClick={() => setIsSignInOpen(true)}
                className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-jost text-sm font-semibold hover:bg-cta transition-all hover:shadow-lg active:scale-95"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            <button className="md:hidden p-3 text-secondary hover:text-primary hover:bg-white/50 rounded-full transition-all">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
};

export default Header;



