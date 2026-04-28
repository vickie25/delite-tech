import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import TrustSignals from '../components/TrustSignals';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  // Mock data for secondary sections
  const laptopDeals = [
    { id: 'l1', name: 'MacBook Pro M3', price: 245000, img: '/src/assets/macbook air m5.jpg', brand: 'Apple', spec: '14" / 16GB / 512GB', rating: 5, reviewsCount: 34, isNew: true },
    { id: 'l2', name: 'HP Spectre x360', price: 175000, img: '/src/assets/lenvovo think pad laptop.jpg', brand: 'HP', spec: 'Intel i7 / 16GB / 1TB', rating: 4, reviewsCount: 18 },
    { id: 'l3', name: 'Dell XPS 15', price: 215000, img: '/src/assets/lenvovo think pad laptop.jpg', brand: 'Dell', spec: 'OLED / i9 / 32GB', rating: 5, reviewsCount: 22, isSale: true },
    { id: 'l4', name: 'Asus ROG Zephyrus', price: 195000, img: '/src/assets/lenvovo think pad laptop.jpg', brand: 'Asus', spec: 'RTX 4070 / 16GB', rating: 5, reviewsCount: 45 },
    { id: 'l5', name: 'Lenovo Yoga 7i', price: 115000, img: '/src/assets/lenvovo think pad laptop.jpg', brand: 'Lenovo', spec: 'i5 / 8GB / 512GB', rating: 4, reviewsCount: 12 },
    { id: 'l6', name: 'Surface Laptop 5', price: 135000, img: '/src/assets/macbook air m5.jpg', brand: 'Microsoft', spec: '13.5" / i7 / 16GB', rating: 4, reviewsCount: 29 },
  ];

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Categories />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <TrustSignals />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <FeaturedProducts />
      </motion.div>

      {/* Flagship Deals Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="container"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-jost text-sm font-bold text-cta tracking-widest uppercase mb-2">Editor's Choice</p>
            <h2 className="section-title">Flagship Laptops</h2>
          </div>
          <Link to="/category/laptops" className="see-all-link group">
            Browse All Laptops
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="product-grid">
          {laptopDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.section>

      {/* Promotional Banner Strip */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="container"
      >
        <div className="w-full h-[300px] md:h-[400px] glass-card rounded-[40px] flex items-center overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/40 z-10" />
          <div className="relative z-20 p-12 md:p-20 space-y-6 max-w-2xl text-white">
            <h3 className="font-bodoni text-4xl md:text-6xl font-bold leading-tight">Think Different. <br/>Think Delight.</h3>
            <p className="font-jost text-lg opacity-80">Explore the full range of the Apple ecosystem, curated for excellence.</p>
            <Link 
              to="/category/phones" 
              className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-cta hover:text-white transition-all shadow-xl active:scale-95"
            >
              Explore Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1 }}
            src="/src/assets/iphone 17 pro max.jpg" 
            alt="Apple" 
            className="h-[120%] object-contain absolute right-[-100px] bottom-[-100px] rotate-[-15deg] z-0 opacity-50 group-hover:opacity-100 transition-opacity" 
          />
        </div>
      </motion.section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <Newsletter />
      </motion.div>
    </div>
  );
};

export default Home;


