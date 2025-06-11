'use client';
import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { useTheme } from '@/context/ThemeProvider';

const MainLayout = ({ menuItems, children }) => {
    const { colors } = useTheme();

    const layoutStyle = {
        backgroundColor: colors.background,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
    };

    return (
        <div style={layoutStyle}>
            <Header menuItems={menuItems} />
            <div style={{ paddingTop: '64px' }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
