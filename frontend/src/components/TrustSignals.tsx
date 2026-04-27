import React from 'react';

const signals = [
  { icon: 'fa-truck-fast', title: 'Free Delivery', desc: 'Orders over $500' },
  { icon: 'fa-shield-check', title: '2 Year Warranty', desc: 'Certified quality' },
  { icon: 'fa-award', title: 'Genuine Products', desc: '100% Authentic' },
  { icon: 'fa-credit-card', title: 'Secure Payment', desc: 'Encrypted checkout' },
];

const TrustSignals = () => {
  return (
    <section className="border-y border-accent py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {signals.map((s, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center bg-accent text-black rounded-full group-hover:bg-black group-hover:text-white transition-all">
              <i className={`fa-solid ${s.icon} text-sm`}></i>
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-tight">{s.title}</h4>
              <p className="text-[10px] text-black/40 font-bold uppercase">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSignals;
