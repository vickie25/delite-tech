import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

const slides = [
  {
    id: 1,
    eyebrow: 'Future of Innovation',
    title: 'Precision in Every Pixel',
    description: 'Experience the new standard of hardware with our most advanced collection yet.',
    cta: 'Explore Collection',
    link: '/shop',
    img: '/iphone 17 pro max.jpg',
    color: '#CA8A04'
  },
  {
    id: 2,
    eyebrow: 'Elegance & Power',
    title: 'The New MacBook Pro',
    description: 'Boundless power meets a stunning minimalist design. Built for those who create.',
    cta: 'Learn More',
    link: '/category/laptops',
    img: '/macbook air m5.jpg',
    color: '#1C1917'
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Gradient/Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-stone-50 to-stone-200" />
          
          <div className="container h-full flex flex-col md:flex-row items-center justify-between relative pt-20">
            {/* Content Area */}
            <div className="w-full md:w-1/2 z-10 px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-6"
              >
                <p className="font-jost text-sm font-bold tracking-[0.3em] text-cta uppercase">
                  {slides[current].eyebrow}
                </p>
                <h1 className="font-bodoni text-[56px] md:text-[84px] leading-[1.1] font-semibold text-primary">
                  {slides[current].title}
                </h1>
                <p className="font-jost text-lg md:text-xl text-secondary max-w-lg">
                  {slides[current].description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full">
                    <Link to={slides[current].link} className="flex items-center gap-2">
                      {slides[current].cta}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full">
                    Watch Film
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Visual Area */}
            <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                {/* Floating Glass Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cta/10 blur-[120px] rounded-full animate-float" />
                
                <img
                  src={slides[current].img}
                  alt={slides[current].title}
                  className="max-w-[110%] max-h-[80%] object-contain drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] select-none"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute bottom-12 left-12 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative w-12 h-1 overflow-hidden bg-primary/10 rounded-full transition-all"
          >
            <motion.div 
              className="absolute inset-0 bg-cta"
              initial={{ x: "-100%" }}
              animate={i === current ? { x: "0%" } : { x: "-100%" }}
              transition={i === current ? { duration: 8, ease: "linear" } : { duration: 0 }}
            />
          </button>
        ))}
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-12 right-12 flex gap-4 z-30">
        <button 
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Hero;


