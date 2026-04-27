import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  condition: 'Mint' | 'Excellent' | 'Good' | 'Fair';
  specs: string;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'Limited' | 'New' | 'Sold Out';
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  originalPrice,
  condition,
  specs,
  rating,
  reviewCount,
  image,
  badge
}) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden border-none shadow-none bg-transparent">
        <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-neutral-50 rounded-2xl flex items-center justify-center p-8 transition-colors group-hover:bg-neutral-100">
          <img 
            src={image} 
            alt={name} 
            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" 
          />
          
          {badge && (
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-black text-white rounded-full">
                {badge}
              </span>
            </div>
          )}

          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white">
            <Heart className="w-4 h-4 text-neutral-400 hover:text-black" />
          </button>
        </div>

        <CardContent className="p-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-medium leading-none truncate">{name}</h3>
              <span className="text-sm font-bold">${price}</span>
            </div>
            
            <p className="text-xs text-neutral-400 font-light truncate">{specs}</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  condition === 'Mint' || condition === 'Excellent' ? "bg-green-500" : "bg-neutral-300"
                )} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {condition} Grade
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-black text-black" />
                <span className="text-[10px] font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-0 mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button className="w-full rounded-xl bg-black text-white h-12 text-[11px] font-bold uppercase tracking-widest">
            <ShoppingCart className="w-3.5 h-3.5 mr-2" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};


export default ProductCard;


