import React from 'react';
import { motion } from 'framer-motion';

const products = [
  { id: 1, name: 'iPhone 15 Pro Blue', price: 999.00, oldPrice: 1099.00, img: '/iphone 15 pro blue titanium.jpg', rating: 5 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 1199.00, oldPrice: 1299.00, img: '/iphone 15 pro max black titanium.jpg', rating: 5 },
  { id: 3, name: 'iPhone 13 Pro Max', price: 899.00, oldPrice: 999.00, img: '/iphone 13 pro max Grapghite.jpg', rating: 4 },
  { id: 4, name: 'iPhone 12 Pro Blue', price: 799.00, oldPrice: 899.00, img: '/iphone 12 pro blue.jpg', rating: 5 },
];

const Deals = () => {
  return (
    <section className="py-20 px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold">Deals Of The Day</h2>
          </div>
          
          <div className="flex gap-4">
            {[ {l: 'Hours', v: '10'}, {l: 'Min', v: '12'}, {l: 'Sec', v: '10'} ].map((t, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm font-bold text-xl border border-primary/10">{t.v}</div>
                <span className="text-[10px] font-bold uppercase mt-1 text-muted-foreground">{t.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-3xl group relative hover:-translate-y-2 transition-all"
            >
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-bold">
                SALE
              </div>
              
              <div className="aspect-square mb-6 overflow-hidden rounded-2xl bg-white/50">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-solid fa-star text-[10px] ${i < product.rating ? 'text-primary' : 'text-gray-200'}`}></i>
                  ))}
                </div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">${product.price}</span>
                  <span className="text-muted-foreground line-through text-sm">${product.oldPrice}</span>
                </div>
              </div>

              <button className="mt-6 w-full bg-white border border-primary/10 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn">
                <i className="fa-solid fa-cart-shopping text-sm group-hover/btn:scale-110 transition-transform"></i>
                <span className="text-sm font-bold">Add to Cart</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;
