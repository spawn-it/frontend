import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';
import ScrollableSection from '../common/ScrollableSection';
import Feature from './Feature';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function FeatureList() {
  const { isDarkMode } = useTheme();

  const features = [
    {
      title: '1-Click Deploy',
      desc: 'Deploy any service with just one click. No complex setup required.',
      icon: <FlashOnIcon />,
      color: '#2196f3',
    },
    {
      title: 'Enterprise Security',
      desc: 'Military-grade security with DDoS protection and SSL certificates.',
      icon: <SecurityIcon />,
      color: '#4caf50',
    },
    {
      title: 'Auto-Scaling',
      desc: 'Automatically scale your resources based on demand.',
      icon: <AutorenewIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box
      sx={{
        py: 10,
        bgcolor: isDarkMode ? '#1E1E1E' : '#f8f9fa',
        transition: 'background-color 0.3s ease',
      }}
      id="features"
    >
      <Container maxWidth="lg">
        <ScrollableSection
          title="Platform Features"
          subtitle="Everything you need to run your services at scale"
          gap={4}
          containerSx={{ mb: 0 }}
          headerSx={{ mb: 6 }}
        >
          {features.map((feat, i) => (
            <Feature
              key={i}
              title={feat.title}
              desc={feat.desc}
              icon={feat.icon}
              color={feat.color}
            />
          ))}
        </ScrollableSection>
      </Container>
    </Box>
  );
}
