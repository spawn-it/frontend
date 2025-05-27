'use client';
import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeProvider';

export default function ServiceCard({ service, isSelected, onSelect }) {
    const { colors, isDarkMode } = useTheme();

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

    const serviceColor = getServiceColor(service.color);

    return (
        <Card
            onClick={onSelect}
            sx={{
                width: 280,
                flexShrink: 0,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                transition: "all 0.3s ease",
                bgcolor: colors.paper,
                border: `2px solid ${isSelected ? serviceColor : colors.border}`,
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                boxShadow: isSelected
                    ? `0 8px 25px rgba(0,0,0,0.15)`
                    : `0 2px 10px rgba(0,0,0,0.05)`,
                "&:hover": {
                    transform: isSelected ? "scale(1.02)" : "scale(1.02)",
                    zIndex: 1,
                    bgcolor: colors.paperHover,
                    boxShadow: `0 8px 25px rgba(0,0,0,0.15)`,
                    "& .MuiCardContent-root": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
            }}
        >
            {/* Service Image */}
            <CardMedia
                component="img"
                height="160"
                image={service.image}
                alt={service.name}
                sx={{
                    borderRadius: 2,
                    transition: "all 0.5s ease",
                    "&:hover": {
                        filter: "brightness(1.1)",
                    },
                }}
            />

            {/* Selection Indicator */}
            {isSelected && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                        zIndex: 2
                    }}
                >
                    <CheckCircleIcon sx={{ color: serviceColor }} />
                </Box>
            )}

            {/* Service Info Overlay */}
            <CardContent
                className="MuiCardContent-root"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: isDarkMode
                        ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    color: "white",
                    p: 2,
                    pt: 3,
                    opacity: isSelected ? 1 : 0.8,
                    transform: isSelected ? "translateY(0)" : "translateY(2px)",
                    transition: "all 0.3s ease",
                    borderRadius: "0 0 8px 8px",
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                        {service.icon}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                            fontWeight: "bold",
                            color: "white",
                            textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                        }}
                    >
                        {service.name}
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        color: "rgba(255,255,255,0.9)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                        fontSize: '0.875rem'
                    }}
                >
                    {service.description}
                </Typography>
            </CardContent>
        </Card>
    );
}