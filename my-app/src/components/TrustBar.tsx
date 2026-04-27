import React from 'react';
import { ShieldCheck, RefreshCcw, Truck, Star } from 'lucide-react';

const TrustBar: React.FC = () => {
  const items = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: '12-Month Warranty', label: 'Security' },
    { icon: <Star className="w-5 h-5" />, text: 'Certified Quality', label: 'Standard' },
    { icon: <RefreshCcw className="w-5 h-5" />, text: '30-Day Returns', label: 'Flexibility' },
    { icon: <Truck className="w-5 h-5" />, text: 'Free Shipping', label: 'Delivery' }
  ];

  return (
    <div className="py-12 border-b border-neutral-100 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-black">
                {item.icon}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  {item.label}
                </span>
                <span className="block text-sm font-medium">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;


