import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Confirmation = () => {
  const orderNumber = Math.random().toString(36).toUpperCase().substring(2, 10);
  
  return (
    <div className="pt-48 pb-20 px-6 max-w-xl mx-auto text-center space-y-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-6"
      >
        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="fa-solid fa-check text-2xl"></i>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Order Confirmed.</h1>
        <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
          Thank you for choosing ELECT. Your premium tech is being prepared for shipment.
        </p>
      </motion.div>

      <div className="bg-accent p-8 space-y-4">
        <div className="flex justify-between border-b border-black/5 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Order Number</span>
          <span className="text-[11px] font-black uppercase tracking-tight">#{orderNumber}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Estimated Delivery</span>
          <span className="text-[11px] font-black uppercase tracking-tight">2-3 Business Days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Status</span>
          <span className="text-[11px] font-black uppercase tracking-tight">Processing</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black tracking-widest uppercase">What Happens Next?</h3>
        <p className="text-[10px] font-bold text-black/40 uppercase tracking-tight max-w-xs mx-auto">
          You will receive an email confirmation with tracking details once your order has shipped.
        </p>
      </div>

      <div className="pt-8">
        <Link 
          to="/"
          className="inline-block bg-black text-white px-12 py-4 text-[11px] font-bold tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
