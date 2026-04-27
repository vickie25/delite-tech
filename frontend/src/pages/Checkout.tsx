import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      navigate('/confirmation');
    }, 1000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16">
        {/* Shipping Form */}
        <div className="flex-grow space-y-12">
          <section className="space-y-6">
            <h2 className="text-[10px] font-black tracking-widest uppercase border-b border-black pb-2">1. Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="FIRST NAME" required className="bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="text" placeholder="LAST NAME" required className="bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="email" placeholder="EMAIL ADDRESS" required className="md:col-span-2 bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="tel" placeholder="PHONE NUMBER" required className="md:col-span-2 bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="text" placeholder="DELIVERY ADDRESS" required className="md:col-span-2 bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="text" placeholder="CITY" required className="bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
              <input type="text" placeholder="POSTAL CODE" required className="bg-accent border-none p-3 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black tracking-widest uppercase border-b border-black pb-2">2. Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 'card', name: 'Credit / Debit Card', icon: 'fa-credit-card' },
                { id: 'paypal', name: 'PayPal', icon: 'fa-brands fa-paypal' },
                { id: 'apple', name: 'Apple Pay', icon: 'fa-brands fa-apple-pay' },
              ].map((m) => (
                <label key={m.id} className="flex items-center justify-between p-4 bg-accent cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value={m.id} defaultChecked={m.id === 'card'} className="accent-black" />
                    <span className="text-[11px] font-black uppercase tracking-tight">{m.name}</span>
                  </div>
                  <i className={`fa-solid ${m.icon} text-black/20 group-hover:text-black transition-colors`}></i>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order Review */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-black text-white p-8 space-y-8">
            <h2 className="text-[10px] font-black tracking-widest uppercase border-b border-white/20 pb-4">Order Summary</h2>
            
            <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start text-[11px] font-bold uppercase tracking-tight">
                  <span className="opacity-60">{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/20 space-y-4">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight opacity-60">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                <span className="text-2xl font-black">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-4 text-[11px] font-black tracking-widest uppercase hover:bg-black hover:text-white border border-white transition-all"
            >
              Place Order
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
