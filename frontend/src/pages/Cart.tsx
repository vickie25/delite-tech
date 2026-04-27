import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Your Bag Is Empty</h1>
          <p className="text-sm text-black/40 font-medium uppercase tracking-widest">Maybe it's time to start shopping?</p>
        </div>
        <Link to="/shop" className="inline-block bg-black text-white px-10 py-4 text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">Shopping Bag <span className="text-black/20">({cart.length})</span></h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Item List */}
        <div className="flex-grow space-y-8">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-6 pb-8 border-b border-accent group"
              >
                <div className="w-24 h-24 bg-accent flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-1">Ref: {item.id}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-black/20 hover:text-black transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-accent">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <i className="fa-solid fa-minus text-[8px]"></i>
                      </button>
                      <span className="w-10 text-center text-[11px] font-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <i className="fa-solid fa-plus text-[8px]"></i>
                      </button>
                    </div>
                    <p className="text-sm font-black">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-80 space-y-8 shrink-0">
          <div className="bg-accent p-8 space-y-6">
            <h2 className="text-[10px] font-black tracking-widest uppercase border-b border-black/10 pb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                <span className="text-black/40">Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                <span className="text-black/40">Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                <span className="text-black/40">Estimated Tax</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
              <span className="text-xl font-black">${cartTotal.toLocaleString()}</span>
            </div>

            <Link 
              to="/checkout"
              className="block w-full bg-black text-white text-center py-4 text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all"
            >
              Checkout Now
            </Link>
          </div>
          
          <div className="space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-black/30 leading-relaxed">
              * Taxes and shipping calculated at checkout. Free shipping on all tech orders this week.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
