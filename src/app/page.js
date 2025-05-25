'use client';
import React from 'react';
import MainLayout from '../layouts/MainLayout';

import { categories, testimonials } from './data.js';
import FeatureList from '@/components/features/FeatureList';
import Hero from '@/components/hero/Hero';
import ServiceList from '@/components/services/ServiceList';
import TestimonialList from '@/components/testimonial/TestimonialList';

const menuItems = [
  { label: 'Services', href: '#services' },
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' }
];

const LandingPage = () => {
  return (
    <MainLayout menuItems={menuItems}>
      <Hero />

      <ServiceList categories={categories} />

      <FeatureList />

      <TestimonialList testimonials={testimonials} />

    </MainLayout>
  );
};

export default LandingPage;