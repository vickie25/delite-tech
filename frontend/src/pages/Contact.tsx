import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white pb-24">
      {/* Header Section */}
      <div className="bg-grey-light py-16 mb-12">
        <div className="container">
          <div className="flex flex-col gap-3">
            <h1 className="text-[36px] md:text-[48px] font-poppins font-bold text-black tracking-tight leading-tight">
              Get in Touch
            </h1>
            <p className="text-[16px] font-inter text-grey-text max-w-xl">
              Have questions about our products or need assistance with an order? Our team of tech experts is here to help.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-grey-light rounded-xl space-y-4 border border-grey-mid">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-poppins font-bold text-black">Visit Us</h4>
                  <p className="text-[14px] text-grey-text font-inter leading-relaxed">
                    Delight Plaza, 4th Floor<br />Westlands, Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="p-6 bg-grey-light rounded-xl space-y-4 border border-grey-mid">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-poppins font-bold text-black">Call Us</h4>
                  <p className="text-[14px] text-grey-text font-inter leading-relaxed">
                    +254 700 000 000<br />+254 711 000 000
                  </p>
                </div>
              </div>

              <div className="p-6 bg-grey-light rounded-xl space-y-4 border border-grey-mid">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-poppins font-bold text-black">Email Us</h4>
                  <p className="text-[14px] text-grey-text font-inter leading-relaxed">
                    support@delight.tech<br />sales@delight.tech
                  </p>
                </div>
              </div>

              <div className="p-6 bg-grey-light rounded-xl space-y-4 border border-grey-mid">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-grey-mid">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[16px] font-poppins font-bold text-black">Working Hours</h4>
                  <p className="text-[14px] text-grey-text font-inter leading-relaxed">
                    Mon - Fri: 8:00 AM - 10:00 PM<br />Sat - Sun: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="w-full h-[300px] bg-grey-light rounded-xl border border-grey-mid overflow-hidden relative flex items-center justify-center">
              <MapPin className="w-8 h-8 text-grey-mid absolute" />
              <p className="text-grey-text font-inter text-[14px] relative z-10">Map View Placeholder</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-grey-mid rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-[24px] font-poppins font-bold text-black mb-2">Send us a Message</h2>
            <p className="text-[14px] text-grey-text font-inter mb-10">We'll get back to you as soon as possible.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">First Name</label>
                  <input type="text" placeholder="John" className="w-full bg-grey-light border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-black font-poppins">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full bg-grey-light border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-black font-poppins">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-grey-light border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-black font-poppins">Subject</label>
                <select className="w-full bg-grey-light border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Sales & Partnerships</option>
                  <option>Return & Refund</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-black font-poppins">Message</label>
                <textarea rows={5} placeholder="How can we help you?" className="w-full bg-grey-light border border-grey-mid rounded-lg px-4 py-3 text-[14px] font-inter outline-none focus:border-black transition-all resize-none"></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full h-12 rounded-lg flex items-center justify-center gap-2 text-[15px] transition-all hover:bg-grey-dark active:scale-[0.98]">
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

