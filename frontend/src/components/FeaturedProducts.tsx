import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const products = [
  { id: 'p1', name: 'iPhone 15 Pro Max', price: 1199, img: '/iphone 15 pro max black titanium.jpg', brand: 'Apple' },
  { id: 'p2', name: 'MacBook Air M2', price: 1099, img: '/macbook air.jpg', brand: 'Apple' },
  { id: 'p3', name: 'Samsung Galaxy S24 Ultra', price: 1299, img: '/iphone 15 pro max natural titanium.jpg', brand: 'Samsung' },
  { id: 'p4', name: 'HP EliteBook 840', price: 949, img: '/hp pavilion 15 white.jpg', brand: 'HP' },
  { id: 'p5', name: 'iPhone 14 Pro', price: 999, img: '/iphone 14 pro max purple.jpg', brand: 'Apple' },
  { id: 'p6', name: 'Dell XPS 13', price: 1399, img: '/dell xps 15.jpg', brand: 'Dell' },
  { id: 'p7', name: 'Sony WH-1000XM5', price: 349, img: '/iphone xr blue.jpg', brand: 'Sony' },
  { id: 'p8', name: 'Apple Watch Ultra 2', price: 799, img: '/iphone 12 purple.jpg', brand: 'Apple' },
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-black/40">Curated Selection</span>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Featured Products</h2>
          <div className="w-12 h-1 bg-black"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="aspect-[4/5] bg-accent relative overflow-hidden mb-4">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-black text-white py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-[9px] font-black tracking-widest uppercase text-black/30">{product.brand}</p>
                <h3 className="text-sm font-bold tracking-tight group-hover:underline cursor-pointer">{product.name}</h3>
                <p className="text-sm font-black">${product.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
