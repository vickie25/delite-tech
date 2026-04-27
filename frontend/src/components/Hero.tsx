import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl space-y-8"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40">New Collection 2026</span>
            <h1 className="text-6xl font-black leading-[0.9] tracking-tighter uppercase">
              Premium <br />Technology <br />Simplified.
            </h1>
            <p className="text-sm text-black/60 max-w-sm leading-relaxed font-medium">
              Discover the latest in mobile and computing excellence. Clean design, powerful performance, and unparalleled elegance.
            </p>
          </div>
          
          <div className="flex items-center gap-6 pt-4">
            <Link to="/shop" className="bg-black text-white px-8 py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all">
              Shop Now
            </Link>
            <Link to="/category/phones" className="text-[11px] font-bold tracking-widest uppercase border-b-2 border-black pb-1 hover:opacity-50 transition-opacity">
              View Phones
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent rounded-full -z-10 opacity-50"></div>
          <img 
            src="/iphone 16 pro max.jpg" 
            alt="iPhone 16 Pro Max" 
            className="w-full max-w-md drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
