'use client';
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeProvider';

export default function ProviderCard({ provider, isSelected, onSelect }) {
    const { colors } = useTheme();

    // Mapping des couleurs pour les providers
    const getProviderColor = (colorName) => {
        const colorMap = {
            'primary': '#1976d2',
            'warning': '#ff9800',
            'success': '#4caf50',
            'info': '#2196f3',
            'secondary': '#9c27b0'
        };
        return colorMap[colorName] || '#1976d2';
    };

    const providerColor = getProviderColor(provider.color);

    return (
        <Paper
            onClick={onSelect}
            sx={{
                p: 3,
                borderRadius: 2,
                width: 280,
                flexShrink: 0,
                bgcolor: colors.paper,
                backdropFilter: 'blur(8px)',
                border: `2px solid ${isSelected ? providerColor : colors.border}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isSelected
                    ? `0 8px 25px ${alpha('#000', 0.15)}`
                    : `0 2px 10px ${alpha('#000', 0.05)}`,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha('#000', 0.15)}`,
                    bgcolor: colors.paperHover,
                }
            }}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 2,
                        zIndex: 2
                    }}
                >
                    <CheckCircleIcon sx={{ color: providerColor }} />
                </Box>
            )}

            {/* Provider Icon */}
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: alpha(providerColor, 0.1),
                    color: providerColor,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${alpha(providerColor, 0.2)}`,
                    transition: 'all 0.3s ease',
                    fontSize: '2rem'
                }}
            >
                {provider.icon}
            </Box>

            {/* Provider Info */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: colors.text,
                    transition: 'color 0.3s ease'
                }}
            >
                {provider.name}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease',
                    lineHeight: 1.5
                }}
            >
                {provider.description}
            </Typography>
        </Paper>
    );
}