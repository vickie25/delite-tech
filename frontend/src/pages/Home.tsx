import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import TrustSignals from '../components/TrustSignals';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="page-transition">
      <Hero />
      <TrustSignals />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
};

export default Home;
