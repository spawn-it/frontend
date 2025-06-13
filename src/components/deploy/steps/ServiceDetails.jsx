import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';
import AdvancedConfiguration from './AdvancedConfiguration';

const ServiceDetails = ({ deployConfig, updateConfig }) => {
  const { colors } = useTheme();

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, color: colors.text }}
      >
        Configuration du Service
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: colors.textSecondary }}>
        Configurez les ports et variables d'environnement pour votre service
      </Typography>

      <AdvancedConfiguration
        deployConfig={deployConfig}
        updateConfig={updateConfig}
      />
    </Box>
  );
};

export default ServiceDetails;
