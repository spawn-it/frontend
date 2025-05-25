'use client';
import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '../../context/ThemeProvider';
import ScrollableSection from '../common/ScrollableSection';
import ServiceImage from './ServiceImage';

export default function ServiceList({ categories }) {
  const { colors } = useTheme();

  return (
    <Box 
      sx={{ 
        pt: 4, 
        pb: 4, 
        bgcolor: colors.background, 
        color: colors.text,
        transition: 'all 0.3s ease'
      }} 
      id="services"
    >
      <Container maxWidth="lg">
        {categories.map((category) => (
          <ScrollableSection
            key={category.id}
            title={category.name}
            gap={2}
            containerSx={{ mb: 4 }}
            headerSx={{ mb: 2 }}
          >
            {category.items.map((item) => (
              <ServiceImage
                image={item.image}
                name={item.name}
                key={item.id}
              />
            ))}
          </ScrollableSection>
        ))}
      </Container>
    </Box>
  );
}