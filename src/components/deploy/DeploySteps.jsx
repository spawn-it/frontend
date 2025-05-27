'use client';
import React from 'react';
import { Box, Container, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';

const DeploySteps = ({ steps, currentStep }) => {
    const { colors, isDarkMode } = useTheme();
    const hasSelectedService = currentStep > 0;

    return (
        <Box sx={{
            bgcolor: hasSelectedService
                ? (isDarkMode ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)')
                : colors.background,
            backdropFilter: hasSelectedService ? 'blur(8px)' : 'none',
            borderBottom: `1px solid ${colors.border}`,
            position: hasSelectedService ? 'sticky' : 'static',
            top: 0,
            zIndex: 10
        }}>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Stepper
                    activeStep={currentStep}
                    alternativeLabel
                    sx={{
                        '& .MuiStepLabel-root .Mui-completed': {
                            color: isDarkMode ? '#4caf50' : '#1976d2',
                        },
                        '& .MuiStepLabel-root .Mui-active': {
                            color: isDarkMode ? '#2196f3' : '#1976d2',
                        },
                        '& .MuiStepLabel-root .MuiStepLabel-label': {
                            color: colors.text,
                        },
                        '& .MuiStepConnector-root': {
                            '& .MuiStepConnector-line': {
                                borderColor: colors.border,
                            }
                        }
                    }}
                >
                    {steps.map((step) => (
                        <Step key={step.number}>
                            <StepLabel>
                                <Typography variant="body2" fontWeight="medium" sx={{ color: colors.text }}>
                                    {step.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                    {step.desc}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Container>
        </Box>
    );
};

export default DeploySteps;