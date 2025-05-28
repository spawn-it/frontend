'use client';
import React from 'react';
import { Box, Container, Typography, Divider, Link } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';

const Footer = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Box 
      sx={{ 
        bgcolor: isDarkMode ? '#0A0A0A' : '#f8f9fa', 
        borderTop: 1, 
        borderColor: colors.border,
        transition: 'all 0.3s ease',
          mt: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', sm: 'center' },
            mb: { xs: 3, sm: 0 }
          }}
        >
        </Box>

        <Divider 
          sx={{ 
            my: 2, 
            bgcolor: colors.border,
            transition: 'background-color 0.3s ease'
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.textMuted, 
            textAlign: 'center',
            transition: 'color 0.3s ease'
          }}
        >
          &copy; 2025 SpawnIt. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;