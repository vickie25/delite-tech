import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'iphones', name: 'iPhones', image: '/iphone 14 pro black.jpg', count: '124' },
  { id: 'macbooks', name: 'MacBooks', image: '/macbook air m5.jpg', count: '86' },
  { id: 'laptops', name: 'Laptops', image: '/lenvovo think pad laptop.jpg', count: '92' },
  { id: 'audio', name: 'Audio', image: '/icons.svg', count: '38' }
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              className="group relative aspect-square bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 transition-all hover:bg-black"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-contain filter group-hover:brightness-0 group-hover:invert transition-all" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{cat.name}</h3>
                <span className="text-[10px] font-medium text-neutral-400 group-hover:text-neutral-500 transition-colors">{cat.count} Items</span>
              </div>
              
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;


