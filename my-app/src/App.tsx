import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, ArrowRight, ShieldCheck, RefreshCcw, Truck, Star } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import CategoryGrid from './components/CategoryGrid';
import ProductCard from './components/ProductCard';

// Dummy Data
const featuredDeals = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    price: 649,
    originalPrice: 999,
    condition: 'Excellent' as const,
    specs: '128GB · Space Black',
    rating: 4.8,
    reviewCount: 312,
    image: '/iphone 14 pro black.jpg',
    badge: 'Limited' as const
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    price: 899,
    originalPrice: 1199,
    condition: 'Mint' as const,
    specs: '256GB · Titanium',
    rating: 4.9,
    reviewCount: 156,
    image: '/iphone 15 pro max black titanium.jpg',
    badge: 'New' as const
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    price: 849,
    originalPrice: 1099,
    condition: 'Mint' as const,
    specs: '8GB RAM · 256GB SSD',
    rating: 4.9,
    reviewCount: 42,
    image: '/macbook air m5.jpg'
  },
  {
    id: '4',
    name: 'ThinkPad X1 Carbon',
    price: 799,
    originalPrice: 1299,
    condition: 'Excellent' as const,
    specs: 'i7 · 16GB · 512GB',
    rating: 4.7,
    reviewCount: 28,
    image: '/lenvovo think pad laptop.jpg'
  }
];

const HomePage = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Hero />
    <TrustBar />
    <CategoryGrid />

    {/* Featured Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-light tracking-tight mb-2">Essential Drops</h2>
            <p className="text-neutral-500">Curated certified tech for the modern professional.</p>
          </div>
          <Link to="/category/all" className="group flex items-center gap-2 text-sm font-medium hover:text-neutral-500 transition-colors">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredDeals.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>

    {/* Minimalist CTA */}
    <section className="py-24 border-y border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-light tracking-tighter mb-8 leading-tight">
            Sustainability meets performance.<br />
            Our tech is built to last.
          </h2>
          <button className="h-14 px-10 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors">
            Learn Our Process
          </button>
        </div>
      </div>
    </section>
  </motion.div>
);

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20 min-h-screen"
    >
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-light tracking-tighter mb-12 capitalize">{id} Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredDeals.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
        <Header />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="py-20 bg-neutral-50 border-t border-neutral-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-1">
                <div className="text-2xl font-bold tracking-tighter mb-6">DELITE</div>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Redefining ownership through premium refurbished technology.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Collections</h4>
                <ul className="space-y-4 text-sm text-neutral-500">
                  <li><Link to="/category/iphones" className="hover:text-black transition-colors">iPhones</Link></li>
                  <li><Link to="/category/macbooks" className="hover:text-black transition-colors">MacBooks</Link></li>
                  <li><Link to="/category/audio" className="hover:text-black transition-colors">Audio</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-neutral-500">
                  <li><Link to="#" className="hover:text-black transition-colors">About</Link></li>
                  <li><Link to="#" className="hover:text-black transition-colors">Contact</Link></li>
                  <li><Link to="#" className="hover:text-black transition-colors">Warranty</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                <p className="text-sm text-neutral-500 mb-6">Minimal drops, maximum value.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="flex-1 bg-white border border-neutral-200 px-4 py-2 text-sm rounded-full outline-none focus:border-black transition-colors" />
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium rounded-full">Join</button>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:row items-center justify-between gap-6 pt-10 border-t border-neutral-100 text-[10px] uppercase tracking-widest text-neutral-400">
              <span>© 2026 DELITE TECH.</span>
              <div className="flex gap-8">
                <Link to="#">Privacy</Link>
                <Link to="#">Terms</Link>
                <Link to="#">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;


