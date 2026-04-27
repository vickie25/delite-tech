import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max', price: 1199, img: '/iphone 15 pro max black titanium.jpg', category: 'phones', subcategory: 'iPhone', brand: 'Apple' },
  { id: 'p2', name: 'MacBook Air M2', price: 1099, img: '/macbook air.jpg', category: 'laptops', subcategory: 'Apple MacBook', brand: 'Apple' },
  { id: 'p3', name: 'Samsung Galaxy S24', price: 1299, img: '/iphone 15 pro max natural titanium.jpg', category: 'phones', subcategory: 'Samsung', brand: 'Samsung' },
  { id: 'p4', name: 'HP EliteBook 840', price: 949, img: '/hp pavilion 15 white.jpg', category: 'laptops', subcategory: 'HP', brand: 'HP' },
  { id: 'p5', name: 'iPhone 14 Pro', price: 999, img: '/iphone 14 pro max purple.jpg', category: 'phones', subcategory: 'iPhone', brand: 'Apple' },
  { id: 'p6', name: 'Dell XPS 13', price: 1399, img: '/dell xps 15.jpg', category: 'laptops', subcategory: 'Dell', brand: 'Dell' },
  { id: 'p7', name: 'Apple USB-C Cable', price: 19, img: '/iphone xr blue.jpg', category: 'accessories', subcategory: 'Chargers and Cables', brand: 'Apple' },
  { id: 'p8', name: 'Apple Watch Ultra', price: 799, img: '/iphone 12 purple.jpg', category: 'accessories', subcategory: 'Earphones and Headphones', brand: 'Apple' },
];

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const filteredProducts = ALL_PRODUCTS.filter(p => p.category === id?.toLowerCase());

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Collection</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mt-2">{id}</h1>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{filteredProducts.length} Products Found</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group"
          >
            <div className="aspect-[4/5] bg-accent relative overflow-hidden mb-4">
              <img src={product.img} alt={product.name} className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-end p-4 opacity-0 group-hover:opacity-100">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-black text-white py-2.5 text-[10px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all"
                >
                  Quick Add
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black tracking-widest uppercase text-black/30">{product.brand}</p>
              <h3 className="text-sm font-bold tracking-tight">{product.name}</h3>
              <p className="text-sm font-black">${product.price.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-8">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-20">No Products in this Category</p>
          <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all">
            Return to Shop
          </Link>
        </div>
      )}
    </div>
  );
};

export default Category;
