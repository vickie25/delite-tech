import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, logout } = useCustomerAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Phones', path: '/category/phones' },
    { name: 'Laptops', path: '/category/laptops' },
    { name: 'Tablets', path: '/category/tablets' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Wearables', path: '/category/wearables' },
    { name: 'Gaming', path: '/category/gaming' },
    { name: 'More', path: '/shop' },
  ];

  return (
    <header className="w-full z-50 bg-white">
      {/* TOP UTILITY BAR */}
      <div className="bg-black text-white h-8 flex items-center justify-between px-5">
        <div className="flex-1"></div>
        <p className="text-[12px] font-inter font-medium tracking-tight">
          Free shipping on orders over $500
        </p>
        <div className="flex-1 flex justify-end gap-4">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-[11px] font-inter hover:opacity-70 transition-opacity">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-[11px] font-inter hover:opacity-70 transition-opacity">Login</Link>
          )}
          <Link to="/contact" className="text-[11px] font-inter hover:opacity-70 transition-opacity">Support</Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-grey-mid h-16 flex items-center">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-[20px] font-poppins font-bold tracking-tight text-black flex-shrink-0">
            DELIGHT TECH
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[480px] mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full h-10 bg-grey-light border border-grey-mid rounded-full pl-10 pr-4 font-inter text-[13px] outline-none focus:border-black focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link to="/wishlist" className="text-black hover:opacity-70 transition-opacity hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="text-black hover:opacity-70 transition-opacity relative group">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={isAuthenticated ? "/" : "/login"} className="text-black hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
            </Link>
            <button 
              className="md:hidden text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV */}
      <div className="border-b border-grey-mid h-11 hidden md:flex items-center">
        <div className="container overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-inter text-[13px] font-medium text-black px-4 h-11 flex items-center whitespace-nowrap hover:border-b-2 hover:border-black transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-grey-mid animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-text" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 bg-grey-light border border-grey-mid rounded-full pl-10 pr-4 text-[13px] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-inter text-[14px] font-medium py-2 border-b border-grey-mid last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

