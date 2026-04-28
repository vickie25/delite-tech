import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

const signals = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over KSh 50,000' },
  { icon: ShieldCheck, title: 'Genuine Products', desc: '100% Authentic with warranty' },
  { icon: Headphones, title: 'Expert Support', desc: '24/7 technical assistance' },
  { icon: CreditCard, title: 'Secure Payment', desc: 'Encrypted & safe transactions' },
];

const TrustSignals = () => {
  return (
    <section className="bg-grey-light py-8 px-6">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {signals.map((s, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-grey-mid">
              <s.icon className="w-5 h-5 text-black" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[13px] font-poppins font-bold text-black uppercase tracking-tight">{s.title}</h4>
              <p className="text-[11px] text-grey-text font-inter leading-tight">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSignals;

