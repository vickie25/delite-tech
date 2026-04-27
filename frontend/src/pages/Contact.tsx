import React from 'react';

const Contact = () => {
  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-black/40">Connect With Us</span>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">Get In <br />Touch.</h1>
            <p className="text-sm text-black/60 max-w-sm leading-relaxed font-medium">
              Have questions about our premium products or an existing order? Our team is here to assist you 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-accent">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30">Headquarters</h4>
              <p className="text-[11px] font-black uppercase tracking-tight">Silicon Valley, CA <br />United States</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30">Support</h4>
              <p className="text-[11px] font-black uppercase tracking-tight">hello@elect.com <br />+1 234 567 890</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-accent p-10 space-y-8">
          <h2 className="text-[10px] font-black tracking-widest uppercase border-b border-black pb-2">Send A Message</h2>
          <form className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="FULL NAME" required className="bg-white border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
            <input type="email" placeholder="EMAIL ADDRESS" required className="bg-white border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
            <input type="text" placeholder="SUBJECT" className="bg-white border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black" />
            <textarea placeholder="MESSAGE" rows={5} className="bg-white border-none p-4 text-[11px] font-bold uppercase outline-none focus:ring-1 focus:ring-black resize-none"></textarea>
            <button type="submit" className="bg-black text-white py-4 text-[11px] font-black tracking-widest uppercase border border-black hover:bg-white hover:text-black transition-all">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
