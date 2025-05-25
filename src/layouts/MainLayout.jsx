'use client';
import React from 'react';
import { Box } from '@mui/material';
import { ThemeProvider, useTheme } from '../context/ThemeProvider';
import Header from './common/Header';
import Footer from './common/Footer';


const MainLayout = ({ menuItems = [], children }) => {
  return (
    <ThemeProvider>
      <LayoutContent menuItems={menuItems}>{children}</LayoutContent>
    </ThemeProvider>
  );
};

const LayoutContent = ({ menuItems, children }) => {
  const { colors } = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      <Header menuItems={menuItems} />
      <Box sx={{ pt: 8 }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;