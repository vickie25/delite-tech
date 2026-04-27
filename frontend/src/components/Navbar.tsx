import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-accent">
      <div className="bg-black text-white py-1.5 text-center text-[10px] font-medium tracking-widest uppercase">
        Free Shipping & Returns On All Orders
      </div>

      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-tighter">
          ELECT<span className="text-black/20">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity uppercase">Home</Link>
          <Link to="/shop" className="text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity uppercase">Shop</Link>
          <Link to="/category/phones" className="text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity uppercase">Phones</Link>
          <Link to="/category/laptops" className="text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity uppercase">Laptops</Link>
          <Link to="/contact" className="text-[11px] font-bold tracking-widest hover:opacity-50 transition-opacity uppercase">Contact</Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block group">
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-accent border-none py-1.5 px-4 pr-10 text-[10px] font-bold focus:ring-1 focus:ring-black outline-none transition-all w-40 group-hover:w-56"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"></i>
          </div>
          
          <Link to="/cart" className="relative group">
            <i className="fa-solid fa-bag-shopping text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          
          <button className="md:hidden">
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
