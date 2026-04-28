import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-grey-mid pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="text-[20px] font-poppins font-bold tracking-tight text-black">
              DELIGHT TECH
            </Link>
            <p className="text-[13px] text-grey-text leading-relaxed font-inter">
              Your one-stop destination for the latest premium mobile phones, laptops, and tech accessories. Experience quality and innovation at your fingertips.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 bg-grey-light rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-grey-light rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-grey-light rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-grey-light rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
              </a>
            </div>
          </div>


          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 font-inter text-[13px]">
              <li><Link to="/shop" className="text-grey-text hover:text-black transition-colors">All Products</Link></li>
              <li><Link to="/category/phones" className="text-grey-text hover:text-black transition-colors">Latest Phones</Link></li>
              <li><Link to="/category/laptops" className="text-grey-text hover:text-black transition-colors">Laptops & PCs</Link></li>
              <li><Link to="/category/accessories" className="text-grey-text hover:text-black transition-colors">Accessories</Link></li>
              <li><Link to="/contact" className="text-grey-text hover:text-black transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-3 font-inter text-[13px]">
              <li><Link to="/shipping" className="text-grey-text hover:text-black transition-colors">Shipping Policy</Link></li>
              <li><Link to="/terms" className="text-grey-text hover:text-black transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-grey-text hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link to="/returns" className="text-grey-text hover:text-black transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/admin" className="text-grey-text hover:text-black transition-colors">Dealer Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-poppins font-bold text-black uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 font-inter text-[13px]">
              <li className="flex gap-3 text-grey-text">
                <MapPin className="w-5 h-5 shrink-0 text-black" />
                <span>123 Tech Avenue, CBD<br />Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-grey-text">
                <Phone className="w-5 h-5 shrink-0 text-black" />
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center gap-3 text-grey-text">
                <Mail className="w-5 h-5 shrink-0 text-black" />
                <span>hello@phonepalace.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-grey-mid flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] font-inter text-grey-text text-center md:text-left">
            © 2026 Delight Tech. All rights reserved. Built with precision.
          </p>
          <div className="flex gap-6 items-center opacity-40">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

