import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Phones', path: '/category/phones', img: '/iphone 15 pro blue titanium.jpg', count: '120+ Products' },
  { name: 'Laptops', path: '/category/laptops', img: '/macbook air.jpg', count: '80+ Products' },
  { name: 'Accessories', path: '/category/accessories', img: '/iphone xr blue.jpg', count: '250+ Products' },
];

const Categories = () => {
  return (
    <section className="py-16 px-6 bg-accent">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Categories</span>
            <h2 className="text-3xl font-black tracking-tighter uppercase mt-2">Browse by Tech</h2>
          </div>
          <Link to="/shop" className="text-[10px] font-black tracking-widest uppercase border-b border-black pb-1 hover:opacity-50 transition-all">
            See All Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 group relative overflow-hidden"
            >
              <div className="relative z-10 space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">{cat.name}</h3>
                <p className="text-[10px] font-bold text-black/40 tracking-widest uppercase">{cat.count}</p>
                <Link 
                  to={cat.path}
                  className="inline-block pt-4 text-[10px] font-black tracking-widest uppercase border-b-2 border-black pb-0.5"
                >
                  Explore
                </Link>
              </div>
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="absolute bottom-[-10%] right-[-10%] w-32 h-32 object-contain grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
