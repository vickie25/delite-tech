import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 15 Pro Max', price: 1199, img: '/iphone 15 pro max black titanium.jpg', category: 'Phones', subcategory: 'iPhone', brand: 'Apple' },
  { id: 'p2', name: 'MacBook Air M2', price: 1099, img: '/macbook air.jpg', category: 'Laptops', subcategory: 'Apple MacBook', brand: 'Apple' },
  { id: 'p3', name: 'Samsung Galaxy S24', price: 1299, img: '/iphone 15 pro max natural titanium.jpg', category: 'Phones', subcategory: 'Samsung', brand: 'Samsung' },
  { id: 'p4', name: 'HP EliteBook 840', price: 949, img: '/hp pavilion 15 white.jpg', category: 'Laptops', subcategory: 'HP', brand: 'HP' },
  { id: 'p5', name: 'iPhone 14 Pro', price: 999, img: '/iphone 14 pro max purple.jpg', category: 'Phones', subcategory: 'iPhone', brand: 'Apple' },
  { id: 'p6', name: 'Dell XPS 13', price: 1399, img: '/dell xps 15.jpg', category: 'Laptops', subcategory: 'Dell', brand: 'Dell' },
  { id: 'p7', name: 'Apple USB-C Cable', price: 19, img: '/iphone xr blue.jpg', category: 'Accessories', subcategory: 'Chargers and Cables', brand: 'Apple' },
  { id: 'p8', name: 'Apple Watch Ultra', price: 799, img: '/iphone 12 purple.jpg', category: 'Accessories', subcategory: 'Earphones and Headphones', brand: 'Apple' },
  { id: 'p9', name: 'Infinix Note 40', price: 299, img: '/iphone 14 purple.jpg', category: 'Phones', subcategory: 'Infinix', brand: 'Infinix' },
  { id: 'p10', name: 'Lenovo ThinkPad X1', price: 1599, img: '/hp pavilion 15 white.jpg', category: 'Laptops', subcategory: 'Lenovo', brand: 'Lenovo' },
];

const Shop = () => {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(2000);

  const filteredProducts = ALL_PRODUCTS.filter(p => 
    (filter === 'All' || p.category === filter || p.brand === filter) && p.price <= priceRange
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-48 space-y-10 shrink-0">
          <div>
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-6 border-b border-black pb-2">Categories</h3>
            <div className="flex flex-col gap-3">
              {['All', 'Phones', 'Laptops', 'Accessories'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`text-[11px] font-bold uppercase tracking-tight text-left hover:text-black transition-colors ${filter === cat ? 'text-black' : 'text-black/30'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-6 border-b border-black pb-2">Price Range</h3>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-black h-1 bg-accent rounded-none appearance-none"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase opacity-40">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-6 border-b border-black pb-2">Brands</h3>
            <div className="flex flex-col gap-3">
              {['Apple', 'Samsung', 'HP', 'Dell', 'Infinix'].map(brand => (
                <button 
                  key={brand} 
                  onClick={() => setFilter(brand)}
                  className={`text-[11px] font-bold uppercase tracking-tight text-left hover:text-black transition-colors ${filter === brand ? 'text-black' : 'text-black/30'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Showing {filteredProducts.length} Results</p>
            <select className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer">
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-widest uppercase text-black/30">{product.brand}</p>
                  <h3 className="text-[13px] font-bold tracking-tight">{product.name}</h3>
                  <p className="text-[13px] font-black">${product.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-20 text-center">No Products Found</p>
              <button onClick={() => { setFilter('All'); setPriceRange(2000); }} className="text-[10px] font-black uppercase border-b border-black">Clear Filters</button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Shop;
