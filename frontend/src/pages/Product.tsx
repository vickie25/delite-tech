import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingBag } from 'lucide-react';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 17 Pro Max', price: 185000, originalPrice: 205000, img: '/iphone 17 pro max.jpg', brand: 'Apple', spec: '256GB / 12GB RAM / Titanium', rating: 5, reviewsCount: 124, isNew: true, desc: 'The most powerful iPhone ever. Featuring a custom titanium chassis, the A19 Pro Bionic chip, and an advanced Triple-Lens camera system for professional-grade photography and video.', specs: ['6.7" Dynamic AMOLED', 'A19 Pro Bionic', '2TB Storage Max', '5G Ultra Wideband'] },
  { id: 'p2', name: 'MacBook Air M5', price: 195000, originalPrice: 220000, img: '/macbook air m5.jpg', brand: 'Apple', spec: 'M5 / 16GB / 512GB', rating: 5, reviewsCount: 86, isSale: true, desc: 'Ultra-thin, ultra-powerful. The M5 chip brings unprecedented speed and efficiency to our most portable laptop.', specs: ['13.6" Liquid Retina', 'Apple M5 Chip', '24GB Unified Memory', '2TB SSD Max'] },
  { id: 'p3', name: 'ThinkPad X1 Carbon', price: 210000, img: '/lenvovo think pad laptop.jpg', brand: 'Lenovo', spec: 'i7 / 32GB / 1TB', rating: 4, reviewsCount: 42, desc: 'The gold standard for business computing. Carbon-fiber reinforced chassis with legendary reliability and performance.', specs: ['14" 4K OLED', 'Intel Core Ultra 7', '64GB RAM', 'Windows 11 Pro'] },
  { id: 'p4', name: 'iPhone 16 Pro Max', price: 155000, originalPrice: 175000, img: '/iphone 16 pro max.jpg', brand: 'Apple', spec: '128GB / 8GB RAM', rating: 5, reviewsCount: 512, isSale: true, desc: 'A major leap in battery life and camera performance. The iPhone 16 Pro Max is built for the professionals.', specs: ['6.7" Super Retina XDR', 'A18 Pro Chip', '48MP Main Camera', 'Titanium Design'] },
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];

  return (
    <div className="bg-white pb-24">
      {/* Breadcrumbs */}
      <div className="bg-grey-light py-4 mb-8">
        <div className="container">
          <div className="flex items-center gap-2 text-[12px] font-inter text-grey-text">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-black">Shop</Link>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-grey-light rounded-xl overflow-hidden border border-grey-mid group">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[product.img, product.img, product.img, product.img].map((img, i) => (
                <div key={i} className={`aspect-square bg-grey-light rounded-lg cursor-pointer overflow-hidden border transition-all ${i === 0 ? 'border-black' : 'border-grey-mid hover:border-grey-text'}`}>
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full border border-grey-mid hover:bg-grey-light transition-all">
                    <Heart className="w-4 h-4 text-black" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full border border-grey-mid hover:bg-grey-light transition-all">
                    <Share2 className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
              <h1 className="text-[32px] md:text-[42px] font-poppins font-bold text-black tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[#FFD700]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 fill-current ${i >= product.rating ? 'text-grey-mid' : ''}`} />
                  ))}
                </div>
                <span className="text-[13px] font-inter text-grey-text">({product.reviewsCount} Reviews)</span>
                <span className="text-grey-mid">|</span>
                <span className="text-[13px] font-inter text-accent-green font-bold">In Stock</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[32px] font-poppins font-bold text-black">KSh {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-[20px] font-inter text-grey-text line-through decoration-accent-red">KSh {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <p className="text-[15px] text-grey-text leading-relaxed font-inter">
              {product.desc}
            </p>

            {/* Quantity and CTA */}
            <div className="space-y-6 pt-6 border-t border-grey-mid">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-grey-mid rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-grey-light transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold font-inter">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-grey-light transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-grow h-12 bg-black text-white rounded-lg font-poppins font-bold text-[15px] flex items-center justify-center gap-3 transition-all hover:bg-grey-dark active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add To Cart
                </button>
              </div>
              <button className="w-full h-12 border-2 border-black rounded-lg font-poppins font-bold text-[15px] transition-all hover:bg-black hover:text-white">
                Buy It Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-grey-mid">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-black" />
                <div className="space-y-0.5">
                  <p className="text-[12px] font-bold text-black font-poppins">Fast Delivery</p>
                  <p className="text-[11px] text-grey-text font-inter">Within 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-black" />
                <div className="space-y-0.5">
                  <p className="text-[12px] font-bold text-black font-poppins">Official Warranty</p>
                  <p className="text-[11px] text-grey-text font-inter">24 Months Protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-black" />
                <div className="space-y-0.5">
                  <p className="text-[12px] font-bold text-black font-poppins">Easy Return</p>
                  <p className="text-[11px] text-grey-text font-inter">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Simplified) */}
        <div className="mt-24 border-t border-grey-mid pt-16">
          <div className="flex gap-8 border-b border-grey-mid mb-10">
            <button className="pb-4 border-b-2 border-black font-poppins font-bold text-[16px]">Specifications</button>
            <button className="pb-4 text-grey-text font-poppins font-bold text-[16px] hover:text-black">Reviews</button>
            <button className="pb-4 text-grey-text font-poppins font-bold text-[16px] hover:text-black">Shipping</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between border-b border-grey-mid pb-3">
                <span className="text-[14px] font-inter text-grey-text">Characteristic {i+1}</span>
                <span className="text-[14px] font-inter text-black font-semibold">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-24 pt-16 border-t border-grey-mid">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Customers Also Bought</h2>
            <Link to="/shop" className="see-all-link">See All →</Link>
          </div>
          <div className="product-grid">
            {ALL_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;

