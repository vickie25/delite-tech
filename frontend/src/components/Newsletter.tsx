import { Send } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-[28px] md:text-[36px] font-poppins font-bold tracking-tight leading-tight">
            Join Our Newsletter
          </h2>
          <p className="text-[14px] font-inter text-grey-mid max-w-lg mx-auto">
            Get the latest updates on new arrivals, exclusive deals, and tech insights delivered straight to your inbox.
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-grow">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full h-11 bg-white/10 border border-white/20 rounded px-4 text-[14px] font-inter outline-none focus:border-white transition-all text-white placeholder:text-white/40"
            />
          </div>
          <button className="bg-white text-black h-11 px-8 rounded font-inter font-bold text-[14px] transition-all hover:bg-grey-light flex items-center justify-center gap-2">
            Subscribe
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] font-inter text-white/30">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;

