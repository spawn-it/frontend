'use client';
import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeProvider';
import ServiceCard from './ServiceCard';

const ServiceCardList = ({
  services,
  serviceTypes,
  onApplyTerraform,
  onDestroyService,
  onDeleteService
}) => {
  const { colors } = useTheme();

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: colors.text }}>
          Active Services
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            sx={{
              border: 1,
              borderColor: colors.border,
              color: colors.textSecondary,
              '&:hover': {
                borderColor: colors.inputBorderHover,
                bgcolor: colors.inputBg
              }
            }}
          >
            <ArrowBackIcon/>
          </IconButton>
          <IconButton
            size="small"
            sx={{
              border: 1,
              borderColor: colors.border,
              color: colors.textSecondary,
              '&:hover': {
                borderColor: colors.inputBorderHover,
                bgcolor: colors.inputBg
              }
            }}
          >
            <ArrowForwardIcon/>
          </IconButton>
        </Stack>
      </Box>
      
      <Box display="flex" gap={3} flexWrap="wrap">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            serviceTypes={serviceTypes}
            onApplyTerraform={onApplyTerraform}
            onDestroyService={onDestroyService}
            onDeleteService={onDeleteService}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ServiceCardList;