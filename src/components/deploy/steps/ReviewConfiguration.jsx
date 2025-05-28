'use client';
import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';

const ReviewConfiguration = ({ deployConfig, services, providers }) => {
    const { colors } = useTheme();

    const selectedService = services
        .flatMap(category => category.items)
        .find(service => service.name === deployConfig.service);

    const selectedProvider = providers.find(p => p.id === deployConfig.provider);

    const portEntries = Object.entries(deployConfig.ports || {});
    const envVarEntries = Object.entries(deployConfig.env_vars || {});

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: colors.text }}>
                Vérification de la Configuration
            </Typography>
            <Box sx={{ maxWidth: 600 }}>
                <Stack spacing={3} divider={<Divider sx={{ borderColor: colors.border }} />}>

                    <Box>
                        <Typography variant="overline" sx={{ color: colors.textSecondary }}>
                            Type de Service
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            {selectedService ? (
                                <Typography variant="body1" fontWeight="medium" sx={{ color: colors.text }}>
                                    {selectedService.label}
                                </Typography>
                            ) : (
                                <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                                    Non sélectionné
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="overline" sx={{ color: colors.textSecondary }}>
                            Fournisseur d'Infrastructure
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            {selectedProvider ? (
                                <Typography variant="body1" fontWeight="medium" sx={{ color: colors.text }}>
                                    {selectedProvider.name}
                                </Typography>
                            ) : (
                                <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                                    Non sélectionné
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="overline" sx={{ color: colors.textSecondary }}>
                            Ports
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            {portEntries.length > 0 ? (
                                portEntries.map(([exposed, internal], index) => (
                                    <Typography key={index} variant="body2" sx={{ color: colors.text, fontFamily: 'monospace' }}>
                                        {exposed} → {internal}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                    Aucun port configuré
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="overline" sx={{ color: colors.textSecondary }}>
                            Variables d'Environnement
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            {envVarEntries.length > 0 ? (
                                envVarEntries.map(([key, value], index) => (
                                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: colors.text }}>
                                        {key}={value}
                                    </Typography>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                    Aucune variable définie
                                </Typography>
                            )}
                        </Box>
                    </Box>

                </Stack>
            </Box>
        </Box>
    );
};

export default ReviewConfiguration;
