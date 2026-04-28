import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    img: string;
    brand: string;
    spec?: string;
    rating?: number;
    reviewsCount?: number;
    isNew?: boolean;
    isSale?: boolean;
    discount?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card group bg-white border border-grey-mid rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Card Image Section */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-grey-light p-4 overflow-hidden">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-accent-green text-white text-[10px] font-inter font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">NEW</span>
          )}
          {product.isSale && (
            <span className="bg-accent-red text-white text-[10px] font-inter font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">SALE</span>
          )}
          {product.discount && (
            <span className="bg-accent-red text-white text-[10px] font-inter font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">{product.discount}</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white border border-grey-mid rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-grey-light z-10">
          <Heart className="w-4 h-4 text-grey-text hover:text-accent-red transition-colors" />
        </button>
      </Link>

      {/* Card Body */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {/* Brand */}
        <p className="text-[11px] font-inter text-grey-text font-medium">{product.brand}</p>
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="font-poppins text-[13px] font-medium text-black line-clamp-2 leading-tight hover:text-accent-red transition-colors">
          {product.name}
        </Link>
        
        {/* Spec Line */}
        {product.spec && (
          <p className="text-[11px] font-inter text-grey-text truncate">{product.spec}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex text-accent-yellow">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < (product.rating || 5) ? 'fill-current' : 'text-grey-mid'}`} />
            ))}
          </div>
          <span className="text-[10px] font-inter text-grey-text">({product.reviewsCount || 0})</span>
        </div>

        {/* Price Block */}
        <div className="mt-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-poppins text-[15px] font-bold text-black">KSh {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="font-inter text-[11px] text-grey-text line-through">KSh {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {product.originalPrice && (
            <span className="font-inter text-[11px] font-semibold text-accent-red">Save KSh {(product.originalPrice - product.price).toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="mt-3 w-full h-8 bg-black text-white font-inter text-[12px] font-semibold rounded border border-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
