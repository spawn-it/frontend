'use client';
import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';
import { availableServices, infrastructureProviders } from '@/data/deployData';

const ReviewConfiguration = ({ deployConfig }) => {
    const { colors } = useTheme();
    const selectedService = availableServices.find(s => s.id === deployConfig.serviceType);
    const selectedProvider = infrastructureProviders.find(p => p.id === deployConfig.provider);

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
                            {selectedService && (
                                <>
                                    <Typography variant="h6">{selectedService.icon}</Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ color: colors.text }}>
                                        {selectedService.name}
                                    </Typography>
                                </>
                            )}
                            {!selectedService && (
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
                            {selectedProvider && (
                                <>
                                    <Typography variant="h6">{selectedProvider.icon}</Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ color: colors.text }}>
                                        {selectedProvider.name}
                                    </Typography>
                                </>
                            )}
                            {!selectedProvider && (
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
                            {deployConfig.ports.filter(port => port.exposed && port.internal).map((port, index) => (
                                <Typography key={index} variant="body2" sx={{ color: colors.text, fontFamily: 'monospace' }}>
                                    {port.exposed} → {port.internal}
                                </Typography>
                            ))}
                            {deployConfig.ports.filter(port => port.exposed && port.internal).length === 0 && (
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
                            {deployConfig.envVars.filter(env => env.key).map((env, index) => (
                                <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: colors.text }}>
                                    {env.key}={env.value}
                                </Typography>
                            ))}
                            {deployConfig.envVars.filter(env => env.key).length === 0 && (
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