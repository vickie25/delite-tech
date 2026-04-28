import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 17 Pro Max', price: 185000, originalPrice: 205000, img: '/iphone 17 pro max.jpg', category: 'Phones', brand: 'Apple', spec: '256GB / 12GB RAM', rating: 5, reviewsCount: 124, isNew: true },
  { id: 'p2', name: 'MacBook Air M5', price: 195000, originalPrice: 220000, img: '/macbook air m5.jpg', category: 'Laptops', brand: 'Apple', spec: 'M5 / 16GB / 512GB', rating: 5, reviewsCount: 86, isSale: true },
  { id: 'p3', name: 'ThinkPad X1 Carbon', price: 210000, img: '/lenvovo think pad laptop.jpg', category: 'Laptops', brand: 'Lenovo', spec: 'i7 / 32GB / 1TB', rating: 4, reviewsCount: 42 },
  { id: 'p4', name: 'iPhone 16 Pro Max', price: 155000, originalPrice: 175000, img: '/iphone 16 pro max.jpg', category: 'Phones', brand: 'Apple', spec: '128GB / 8GB RAM', rating: 5, reviewsCount: 512, isSale: true },
  { id: 'p5', name: 'iPhone 15 Pro Max', price: 135000, img: '/iphone 15 pro max black titanium.jpg', category: 'Phones', brand: 'Apple', spec: '256GB / 8GB RAM', rating: 5, reviewsCount: 89 },
  { id: 'p6', name: 'HP Pavilion 15', price: 85000, img: '/hp pavilion laptop.jpg', category: 'Laptops', brand: 'HP', spec: 'i5 / 8GB / 512GB', rating: 4, reviewsCount: 15 },
  { id: 'p7', name: 'iPhone 14 Pro Black', price: 115000, img: '/iphone 14 pro black.jpg', category: 'Phones', brand: 'Apple', spec: '128GB / 6GB RAM', rating: 4, reviewsCount: 210 },
  { id: 'p8', name: 'iPhone 12 Pro Max', price: 95000, img: '/iphone 12 pro max black.jpg', category: 'Phones', brand: 'Apple', spec: '128GB / 6GB RAM', rating: 4, reviewsCount: 340 },
  { id: 'p9', name: 'iPhone 13 Blue', price: 85000, img: '/iphone 13 blue.jpg', category: 'Phones', brand: 'Apple', spec: '128GB / 4GB RAM', rating: 5, reviewsCount: 180 },
  { id: 'p10', name: 'iPhone SE White', price: 45000, img: '/iphone SE (2nd Gen) white.jpg', category: 'Phones', brand: 'Apple', spec: '64GB / 3GB RAM', rating: 4, reviewsCount: 95 },
  { id: 'p11', name: 'iPhone XR Blue', price: 35000, img: '/iphone xr blue.jpg', category: 'Phones', brand: 'Apple', spec: '64GB / 3GB RAM', rating: 4, reviewsCount: 150 },
  { id: 'p12', name: 'iPhone 11 Black', price: 55000, img: '/iphone 11 black.jpg', category: 'Phones', brand: 'Apple', spec: '64GB / 4GB RAM', rating: 4, reviewsCount: 220 },
];

const Shop = () => {
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [priceRange, setPriceRange] = useState(250000);

  const filteredProducts = ALL_PRODUCTS.filter(p => 
    (category === 'All' || p.category === category) && 
    (brand === 'All' || p.brand === brand) && 
    p.price <= priceRange
  );

  return (
    <div className="bg-white pb-24">
      {/* Header Section */}
      <div className="bg-grey-light py-12 mb-8">
        <div className="container">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] font-inter text-grey-text">
              <Link to="/" className="hover:text-black">Home</Link>
              <span>/</span>
              <span className="text-black font-medium">Shop</span>
            </div>
            <h1 className="text-[32px] font-poppins font-bold text-black tracking-tight">The Catalog</h1>
            <p className="text-[14px] font-inter text-grey-text">Discover our complete collection of premium technology.</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-10 shrink-0">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider flex items-center justify-between">
                Categories
                <ChevronDown className="w-4 h-4 text-grey-text" />
              </h3>
              <div className="flex flex-col gap-3">
                {['All', 'Phones', 'Laptops', 'Tablets', 'Accessories'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className={`text-[13px] font-inter transition-colors ${category === cat ? 'text-black font-semibold' : 'text-grey-text group-hover:text-black'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="250000" 
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-black h-[4px] bg-grey-mid rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[12px] font-inter text-grey-text">
                <span>KSh 0</span>
                <span className="text-black font-bold">KSh {priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider flex items-center justify-between">
                Manufacturer
                <ChevronDown className="w-4 h-4 text-grey-text" />
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {['All', 'Apple', 'Samsung', 'HP', 'Lenovo', 'Infinix'].map(b => (
                  <button 
                    key={b} 
                    onClick={() => setBrand(b)}
                    className={`px-4 py-1.5 rounded-full border text-[12px] font-inter transition-all ${brand === b ? 'bg-black text-white border-black' : 'bg-white text-grey-text border-grey-mid hover:border-black hover:text-black'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-grey-mid gap-4">
              <p className="text-[14px] font-inter text-grey-text">
                Showing <span className="text-black font-bold">{filteredProducts.length}</span> products
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[13px] font-inter text-grey-text">
                  <Filter className="w-4 h-4" />
                  <span>Sort By:</span>
                  <select className="bg-transparent text-black font-bold outline-none cursor-pointer">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Selling</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-grey-text" />
                </div>
                <h3 className="text-[18px] font-poppins font-bold text-black mb-2">No matching products</h3>
                <p className="text-grey-text font-inter text-[14px] mb-8">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => { setCategory('All'); setBrand('All'); setPriceRange(250000); }} 
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Shop;

