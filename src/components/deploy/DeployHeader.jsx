'use client';
import React from 'react';
import { Box, Container, Typography, alpha } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';

const DeployHeader = ({ deployConfig, services }) => {
    const { colors, isDarkMode } = useTheme();
    const selectedService = services
        .flatMap(category => category.items)
        .find(service => service.name === deployConfig.service);



    if (selectedService) {
        return (
            <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                <Box
                    component="img"
                    src={`/img/${selectedService.image_path}`}
                    alt={selectedService.label}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.5,
                        filter: 'brightness(0.5)',
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
                        <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                            {selectedService.label}
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
