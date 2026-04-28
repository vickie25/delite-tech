import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-black selection:text-white">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <CustomerAuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<CustomerSignup />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AppLayout>
        </Router>
      </CustomerAuthProvider>
    </CartProvider>
  );
}

export default App;
