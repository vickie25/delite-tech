import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-white">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 block">
            The Future of Ownership
          </span>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
            Premium Tech.<br />
            <span className="font-medium">Refined.</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-md mb-10 font-light leading-relaxed">
            Curated certified refurbished devices for those who value performance and sustainability.
          </p>
          <div className="flex items-center gap-6">
            <Button size="lg" className="rounded-full px-10 h-14 group">
              Shop Collection <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="link" className="text-black">
              Sell Device
            </Button>
          </div>
        </motion.div>


        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative aspect-square flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-neutral-50 rounded-full scale-90 blur-3xl opacity-50" />
          <img 
            src="/iphone 16 pro max.jpg" 
            alt="iPhone 16 Pro Max" 
            className="relative z-10 w-full max-w-[440px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
          />
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 right-0 w-px h-full bg-neutral-100 hidden lg:block" />
    </section>
  );
};

export default Hero;


