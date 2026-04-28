import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Lock, CreditCard, Smartphone, Wallet, ChevronRight, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate('/confirmation');
    }, 2500);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white py-24 text-center">
        <div className="container max-w-md mx-auto space-y-6">
          <h1 className="text-[28px] font-poppins font-bold text-black">Your cart is empty</h1>
          <p className="text-[14px] text-grey-text font-inter">Please add items to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center px-12 h-12 rounded-lg">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-24">
      {/* Header Section */}
      <div className="bg-grey-light py-12 mb-8">
        <div className="container">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] font-inter text-grey-text">
              <Link to="/cart" className="hover:text-black">Cart</Link>
              <span>/</span>
              <span className="text-black font-medium">Checkout</span>
            </div>
            <h1 className="text-[32px] font-poppins font-bold text-black tracking-tight">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Form Content */}
          <div className="flex-grow space-y-12">
            
            {/* Step 1: Shipping Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-bold">1</div>
                <h2 className="text-[20px] font-poppins font-bold text-black">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">First Name</label>
                  <input type="text" required placeholder="John" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">Last Name</label>
                  <input type="text" required placeholder="Doe" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] font-bold text-black font-poppins">Email Address</label>
                  <input type="email" required placeholder="john@example.com" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] font-bold text-black font-poppins">Street Address</label>
                  <input type="text" required placeholder="123 Tech Street, Westlands" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">City</label>
                  <input type="text" required placeholder="Nairobi" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">Phone Number</label>
                  <input type="tel" required placeholder="+254 700 000 000" className="w-full bg-white border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-bold">2</div>
                <h2 className="text-[20px] font-poppins font-bold text-black">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'card', name: 'Credit Card', icon: CreditCard },
                  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone },
                  { id: 'crypto', name: 'Crypto', icon: Wallet },
                ].map((m) => (
                  <label key={m.id} className="relative block cursor-pointer group">
                    <input type="radio" name="payment" value={m.id} defaultChecked={m.id === 'card'} className="peer sr-only" />
                    <div className="border border-grey-mid rounded-xl p-6 transition-all peer-checked:border-black peer-checked:ring-1 peer-checked:ring-black hover:bg-grey-light/50 flex flex-col items-center gap-3 text-center">
                      <m.icon className="w-6 h-6 text-grey-text peer-checked:text-black" />
                      <span className="text-[14px] font-bold text-black">{m.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Details Placeholder */}
              <div className="bg-grey-light rounded-xl p-6 border border-grey-mid space-y-4">
                <div className="flex items-center gap-3 text-grey-text">
                  <Lock className="w-4 h-4" />
                  <span className="text-[12px] font-inter">Secure encrypted payment gateway</span>
                </div>
                <p className="text-[13px] text-grey-text font-inter italic">
                  Payment details will be requested in the next step via our secure partner portal.
                </p>
              </div>
            </section>
          </div>

          {/* Order Review Sidebar */}
          <aside className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white border border-grey-mid rounded-2xl p-8 space-y-8 sticky top-24 shadow-sm">
              <h2 className="text-[18px] font-poppins font-bold text-black border-b border-grey-mid pb-4">Order Summary</h2>
              
              {/* Item List */}
              <div className="space-y-6 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-grey-mid">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-grey-light rounded-lg border border-grey-mid shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h4 className="text-[14px] font-bold text-black line-clamp-1">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[12px] text-grey-text">Qty: {item.quantity}</span>
                        <span className="text-[13px] font-bold text-black">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-6 border-t border-grey-mid">
                <div className="flex justify-between items-center text-[14px] font-inter">
                  <span className="text-grey-text">Subtotal</span>
                  <span className="text-black font-semibold">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] font-inter">
                  <span className="text-grey-text">Shipping</span>
                  <span className="text-accent-green font-bold text-[12px] uppercase">Free Delivery</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-grey-mid">
                  <span className="text-[16px] font-poppins font-bold text-black">Total</span>
                  <span className="text-[24px] font-poppins font-bold text-black">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                className={`btn-primary w-full h-14 rounded-xl flex items-center justify-center gap-3 text-[16px] transition-all ${isProcessing ? 'opacity-80' : 'hover:scale-[1.02]'}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 py-2 px-4 bg-grey-light rounded-lg border border-grey-mid">
                <ShieldCheck className="w-4 h-4 text-accent-green" />
                <span className="text-[12px] font-bold text-grey-text uppercase tracking-wider">Authenticated Secure Store</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

