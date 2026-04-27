import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 px-6 border-t border-accent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              ELECT<span className="text-black/10">.</span>
            </Link>
            <p className="text-[12px] text-black/50 max-w-sm leading-relaxed font-medium">
              We provide the most advanced technology products with a focus on minimalist design and maximum performance. Your destination for premium tech.
            </p>
            <div className="flex gap-4">
              {[
                { icon: 'fa-facebook-f', link: '#' },
                { icon: 'fa-x-twitter', link: '#' },
                { icon: 'fa-instagram', link: '#' },
                { icon: 'fa-linkedin-in', link: '#' }
              ].map((item, i) => (
                <a key={i} href={item.link} className="w-8 h-8 flex items-center justify-center border border-accent hover:bg-black hover:text-white transition-all rounded-full">
                  <i className={`fa-brands ${item.icon} text-xs`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Information</h4>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight text-black/40">
              <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link to="/delivery" className="hover:text-black transition-colors">Delivery</Link></li>
              <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Account</h4>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-tight text-black/40">
              <li><Link to="/profile" className="hover:text-black transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-black transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-black transition-colors">Cart</Link></li>
              <li><Link to="/admin" className="hover:text-black transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-tight text-black/40">
              <li className="flex items-center gap-2"><i className="fa-solid fa-location-dot"></i> Silicon Valley, CA</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-phone"></i> +1 234 567 890</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-envelope"></i> hello@elect.com</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-accent flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-black/30">
            Copyright © 2026 ELECT. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-xl opacity-20">
            <i className="fa-brands fa-cc-visa"></i>
            <i className="fa-brands fa-cc-mastercard"></i>
            <i className="fa-brands fa-cc-paypal"></i>
            <i className="fa-brands fa-cc-apple-pay"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
