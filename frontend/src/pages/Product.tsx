import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max', price: 1199, img: '/iphone 15 pro max black titanium.jpg', brand: 'Apple', desc: 'The ultimate iPhone with titanium design, A17 Pro chip, and a custom Action button.', specs: ['6.7" OLED Display', '48MP Main Camera', 'USB-C Port', 'Face ID'] },
  // ... more can be added
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  // Find product or use p1 as fallback for demo
  const product = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-accent p-12">
            <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-accent p-4 cursor-pointer hover:bg-black/5 transition-colors">
                <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-black/30">{product.brand}</span>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">{product.name}</h1>
            <p className="text-2xl font-black">${product.price.toLocaleString()}</p>
          </div>

          <p className="text-sm text-black/60 leading-relaxed font-medium max-w-md">
            {product.desc}
          </p>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-y-4">
              {product.specs.map((spec, i) => (
                <div key={i} className="text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  {spec}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => addToCart(product)}
              className="flex-grow bg-black text-white py-4 text-[11px] font-black tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all"
            >
              Add To Cart
            </button>
            <button className="w-14 h-14 flex items-center justify-center border border-accent hover:border-black transition-all">
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>

          <div className="pt-10 border-t border-accent space-y-4">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/40">
              <i className="fa-solid fa-truck-fast"></i>
              <span>Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/40">
              <i className="fa-solid fa-shield-check"></i>
              <span>2 Year Official Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Placeholder */}
      <section className="mt-32">
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-10 border-b border-black pb-4">Related Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 opacity-50">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-accent"></div>
              <div className="h-4 bg-accent w-2/3"></div>
              <div className="h-4 bg-accent w-1/3"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Product;
