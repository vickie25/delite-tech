
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Download } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || Math.random().toString(36).toUpperCase().substring(2, 10);

  return (
    <div className="bg-white py-24">
      <div className="container max-w-2xl mx-auto text-center space-y-12">
        {/* Success Icon & Message */}
        <div className="space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-accent-green/10 text-accent-green flex items-center justify-center mx-auto rounded-full">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h1 className="text-[32px] md:text-[42px] font-poppins font-bold text-black tracking-tight leading-tight">
              Thank You for Your Purchase!
            </h1>
            <p className="text-[16px] font-inter text-grey-text max-w-md mx-auto">
              Your order has been received and is currently being processed by our tech experts.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-grey-light border border-grey-mid rounded-2xl p-8 md:p-10 space-y-8 text-left shadow-sm">
          <div className="flex justify-between items-center border-b border-grey-mid pb-6">
            <div className="space-y-1">
              <span className="text-[12px] font-bold text-grey-text uppercase tracking-wider">Order Number</span>
              <p className="text-[18px] font-poppins font-bold text-black">#{orderNumber}</p>
            </div>
            <button className="flex items-center gap-2 text-[14px] font-medium text-black hover:underline transition-all">
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid shrink-0">
                <Package className="w-5 h-5 text-black" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-poppins font-bold text-black">Processing</h4>
                <p className="text-[13px] text-grey-text font-inter leading-relaxed">
                  We are preparing your items for shipment.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid shrink-0">
                <Truck className="w-5 h-5 text-black" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-poppins font-bold text-black">Estimated Delivery</h4>
                <p className="text-[13px] text-grey-text font-inter leading-relaxed">
                  Your premium hardware will arrive in 2-4 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-8 pt-8">
          <div className="space-y-4">
            <h3 className="text-[18px] font-poppins font-bold text-black">What's Next?</h3>
            <p className="text-[14px] text-grey-text font-inter max-w-sm mx-auto">
              You'll receive an email confirmation shortly with your order details and a tracking link once your package ships.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn-primary w-full sm:w-auto px-10 h-12 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-10 h-12 rounded-lg border border-grey-mid flex items-center justify-center text-[14px] font-bold text-black hover:bg-grey-light transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

