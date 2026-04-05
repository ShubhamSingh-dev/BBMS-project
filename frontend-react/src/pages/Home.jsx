import React, { useState } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import LiveTicker from '../components/LiveTicker';
import Features from '../components/Features';
import BloodStock from '../components/BloodStock';
import Impact from '../components/Impact';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <LiveTicker />
      <Features />
      <BloodStock />
      <Impact />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Home;
