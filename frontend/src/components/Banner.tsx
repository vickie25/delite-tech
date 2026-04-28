const Banner = () => {
  return (
    <section className="px-8 py-10">
      <div className="max-w-7xl mx-auto h-[400px] rounded-[40px] bg-black relative overflow-hidden group">
        <img 
          src="/macbook air m5.jpg" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Score An Extra 40% off <br /> Your Entire Order
          </h2>
          <button className="bg-cta text-white px-10 py-4 rounded-full font-bold hover:bg-cta/90 transition-all shadow-xl shadow-cta/20">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
