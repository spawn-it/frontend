'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';

import { testimonials } from './data.js';
import FeatureList from '@/components/features/FeatureList';
import Hero from '@/components/hero/Hero';
import ServiceList from '@/components/services/ServiceList';
import TestimonialList from '@/components/testimonial/TestimonialList';
import { getCatalog } from '@/services/catalogService';

const menuItems = [
    { label: 'Services', href: '#services' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' }
];

const LandingPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCatalog()
            .then((data) => {
                setServices(data);
            })
            .catch((err) => {
                console.error('Erreur lors du chargement des services :', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <MainLayout menuItems={menuItems}>
            <Hero />

            {loading ? (
                <div className="text-center py-20 text-lg font-medium">Chargement des services...</div>
            ) : (
                <ServiceList categories={services} />
            )}

            <FeatureList />

            <TestimonialList testimonials={testimonials} />
        </MainLayout>
    );
};

export default LandingPage;
