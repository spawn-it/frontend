'use client';
import React from 'react';
import { Box, Container, Typography, alpha } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';
import { availableServices } from '@/data/deployData';

const DeployHeader = ({ deployConfig }) => {
    const { colors, isDarkMode } = useTheme();
    const selectedService = availableServices.find(s => s.id === deployConfig.serviceType);

    if (selectedService) {
        // Mapping des couleurs pour les services
        const getServiceColor = (colorName) => {
            const colorMap = {
                'success': '#4caf50',
                'warning': '#ff9800',
                'info': '#2196f3',
                'primary': '#1976d2',
                'secondary': '#9c27b0'
            };
            return colorMap[colorName] || '#1976d2';
        };

        const serviceColor = getServiceColor(selectedService.color);

        return (
            <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to bottom right, ${alpha(serviceColor, 0.6)}, ${serviceColor})`,
                        opacity: 0.9
                    }}
                />
                <Box
                    component="img"
                    src={selectedService.image}
                    alt={selectedService.name}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        mixBlendMode: 'overlay'
                    }}
                />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)' }} />
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                            {selectedService.icon}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                            {selectedService.name}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, opacity: 0.9, color: 'white' }}>
                            {selectedService.description}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            bgcolor: colors.background,
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: isDarkMode ? '0 1px 3px rgba(255,255,255,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: colors.text }}>
                    Déployer un Nouveau Service
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: colors.textSecondary }}>
                    Suivez les étapes pour configurer le déploiement de votre service
                </Typography>
            </Container>
        </Box>
    );
};

export default DeployHeader;