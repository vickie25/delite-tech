import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-20 px-6 bg-black text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
        <div className="space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">Join The Circle</span>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Stay Ahead Of The Curve.</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 max-w-sm mx-auto">
            Get exclusive access to new releases, limited editions, and premium tech insights.
          </p>
        </div>

        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL" 
            className="flex-grow bg-white/10 border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-white transition-all text-white placeholder:text-white/30"
          />
          <button className="bg-white text-black px-10 py-4 text-[11px] font-black tracking-widest uppercase hover:bg-black hover:text-white border border-white transition-all">
            Subscribe
          </button>
        </form>

        <p className="text-[9px] font-bold uppercase tracking-widest opacity-20">
          * By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none"></div>
    </section>
  );
};

export default Newsletter;
