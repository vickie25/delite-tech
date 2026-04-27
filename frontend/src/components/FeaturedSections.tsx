import React from 'react';
import { motion } from 'framer-motion';

const FeaturedSections = () => {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Exclusive Showcase (Blue) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 bg-cta rounded-[40px] p-10 text-white relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-4">
            <span className="text-cta-foreground/80 font-bold tracking-widest text-sm">$36</span>
            <h2 className="text-4xl font-bold leading-tight">Exclusive <br />Smartwatch</h2>
            <div className="grid grid-cols-2 gap-4 pt-8 text-[10px] font-bold uppercase opacity-80">
              <div>Watch S<br /><span className="text-white">Watch S</span></div>
              <div>360*360<br /><span className="text-white">Resolution</span></div>
              <div>Full-Color Touch<br /><span className="text-white">Screen Type</span></div>
              <div>Bluetooth 5.0<br /><span className="text-white">Connectivity</span></div>
            </div>
          </div>
          
          <img 
            src="/iphone 12 purple.jpg" 
            alt="Exclusive Tech" 
            className="absolute bottom-0 right-0 w-2/3 object-contain group-hover:scale-110 transition-transform duration-700"
          />
        </motion.div>

        {/* Right: Category Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Row */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-surface rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold">Headphone</h3>
                <p className="text-muted-foreground text-sm">200+ Product</p>
                <button className="text-primary text-xs font-bold mt-4 flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
                  See All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
              <img src="/iphone xr blue.jpg" alt="Headphone" className="w-24 h-24 object-contain group-hover:rotate-12 transition-transform" />
            </div>
            
            <div className="bg-[#E0F2FE] rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold">boAt Airdopes</h3>
                <p className="text-muted-foreground text-sm">200+ Product</p>
                <button className="text-primary text-xs font-bold mt-4 flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
                  See All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
              <img src="/iphone 13 pro blue.jpg" alt="Airdopes" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
             <div className="bg-[#FFEDD5] rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold">Bluetooth speaker</h3>
                <p className="text-muted-foreground text-sm">150+ Product</p>
                <button className="text-primary text-xs font-bold mt-4 flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
                  See All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
              <img src="/iphone 14 purple.jpg" alt="Speaker" className="w-24 h-24 object-contain group-hover:-rotate-12 transition-transform" />
            </div>
            
            <div className="bg-[#FEE2E2] rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold">Digital Camera</h3>
                <p className="text-muted-foreground text-sm">100+ Product</p>
                <button className="text-primary text-xs font-bold mt-4 flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
                  See All <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
              <img src="/iphone 15 pro blue titanium.jpg" alt="Camera" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Bottom Feature: Large Earphones Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-12 bg-white border border-primary/5 rounded-[40px] p-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 group overflow-hidden"
        >
          <div className="order-2 lg:order-1 flex justify-center">
            <img 
              src="/iphone 16 pro max.jpg" 
              alt="Featured Product" 
              className="w-full max-w-[400px] object-contain group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">New Arrival</span>
            <h2 className="text-5xl font-bold leading-tight">By Intellect <br />Driven By Values</h2>
            <p className="text-muted-foreground text-lg">
              Experience the next generation of technology with our latest premium selection.
            </p>
            <button className="bg-foreground text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all">
              SHOP NOW
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedSections;
