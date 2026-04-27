import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-neutral-100 py-3' : 'bg-white py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          DELITE
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {['iPhones', 'MacBooks', 'Laptops', 'iPads'].map((item) => (
            <Link 
              key={item} 
              to={`/category/${item.toLowerCase()}`}
              className="text-[13px] font-medium text-neutral-500 hover:text-black transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-neutral-50 rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
          </button>
          <button className="hidden md:block p-2 hover:bg-neutral-50 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 hover:bg-neutral-50 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;


