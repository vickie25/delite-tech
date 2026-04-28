import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-white py-24 text-center">
        <div className="container max-w-md mx-auto space-y-8">
          <div className="w-24 h-24 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-grey-text" />
          </div>
          <div className="space-y-4">
            <h1 className="text-[28px] md:text-[32px] font-poppins font-bold text-black tracking-tight">Your cart is empty</h1>
            <p className="text-[14px] text-grey-text font-inter">Looks like you haven't added any premium tech to your collection yet.</p>
          </div>
          <Link to="/shop" className="btn-primary inline-flex items-center px-12 h-12 rounded-lg">
            Start Shopping
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
              <Link to="/" className="hover:text-black">Home</Link>
              <span>/</span>
              <span className="text-black font-medium">Shopping Cart</span>
            </div>
            <h1 className="text-[32px] font-poppins font-bold text-black tracking-tight">Shopping Cart</h1>
            <p className="text-[14px] font-inter text-grey-text">You have {cart.length} premium units in your queue.</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Item List */}
          <div className="flex-grow">
            <div className="border border-grey-mid rounded-xl overflow-hidden">
              <table className="w-full text-left font-inter">
                <thead className="bg-grey-light text-[12px] font-bold text-grey-text uppercase tracking-wider border-b border-grey-mid">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 hidden md:table-cell">Price</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-mid">
                  {cart.map((item) => (
                    <tr key={item.id} className="group hover:bg-grey-light/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex gap-4">
                          <div className="w-20 h-24 bg-grey-light rounded-lg overflow-hidden border border-grey-mid shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex flex-col justify-between py-1">
                            <div>
                              <h3 className="text-[14px] font-bold text-black line-clamp-1">{item.name}</h3>
                              <p className="text-[12px] text-grey-text mt-1">ID: {item.id}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1.5 text-[12px] font-medium text-accent-red hover:underline transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 hidden md:table-cell">
                        <span className="text-[14px] font-medium text-black">KSh {item.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center border border-grey-mid rounded-lg w-fit overflow-hidden bg-white">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-grey-light transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-[13px] font-bold text-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-grey-light transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-[14px] font-bold text-black">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Link to="/shop" className="text-[14px] font-bold text-black flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white border border-grey-mid rounded-xl p-8 space-y-6 sticky top-24 shadow-sm">
              <h2 className="text-[18px] font-poppins font-bold text-black tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-[14px] font-inter">
                  <span className="text-grey-text">Subtotal</span>
                  <span className="text-black font-semibold">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[14px] font-inter">
                  <span className="text-grey-text">Shipping</span>
                  <span className="text-accent-green font-bold uppercase text-[12px]">Free Delivery</span>
                </div>
                <div className="flex justify-between items-center text-[14px] font-inter">
                  <span className="text-grey-text">Estimated Tax</span>
                  <span className="text-black font-semibold">KSh 0.00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-grey-mid flex justify-between items-end">
                <span className="text-[16px] font-poppins font-bold text-black">Total</span>
                <span className="text-[24px] font-poppins font-bold text-black">KSh {cartTotal.toLocaleString()}</span>
              </div>

              <div className="space-y-3 pt-4">
                <Link 
                  to="/checkout"
                  className="btn-primary w-full h-12 rounded-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <p className="text-[12px] text-center text-grey-text font-inter flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-green" />
                  Secure checkout with 256-bit encryption
                </p>
              </div>

              <div className="pt-6 flex items-center justify-center gap-4 opacity-50 grayscale scale-90">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;

