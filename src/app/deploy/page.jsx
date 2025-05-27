'use client';
import React, { useState } from 'react';
import { Box, Container, Paper } from '@mui/material';
import MainLayout from '../../layouts/MainLayout';
import { useTheme } from '@/context/ThemeProvider';

import DeployHeader from '@/components/deploy/DeployHeader';
import DeploySteps from '@/components/deploy/DeploySteps';
import ServiceSelection from '@/components/deploy/steps/ServiceSelection';
import ProviderSelection from '@/components/deploy/steps/ProviderSelection';
import ServiceDetails from '@/components/deploy/steps/ServiceDetails';
import ReviewConfiguration from '@/components/deploy/steps/ReviewConfiguration';
import NavigationButtons from '@/components/deploy/NavigationButtons';

import { deployConfig as initialConfig, steps } from '@/data/deployData';

function DeployFlowContent() {
    const { colors } = useTheme();
    const [currentStep, setCurrentStep] = useState(0);
    const [deployConfig, setDeployConfig] = useState(initialConfig);

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const updateConfig = (key, value) => {
        setDeployConfig(prev => ({ ...prev, [key]: value }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <ServiceSelection
                        deployConfig={deployConfig}
                        updateConfig={updateConfig}
                    />
                );
            case 1:
                return (
                    <ProviderSelection
                        deployConfig={deployConfig}
                        updateConfig={updateConfig}
                    />
                );
            case 2:
                return (
                    <ServiceDetails
                        deployConfig={deployConfig}
                        updateConfig={updateConfig}
                    />
                );
            case 3:
                return (
                    <ReviewConfiguration
                        deployConfig={deployConfig}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: colors.background,
            color: colors.text,
            transition: 'all 0.3s'
        }}>
            <DeployHeader deployConfig={deployConfig} />
            <DeploySteps steps={steps} currentStep={currentStep} />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        border: `1px solid ${colors.border}`,
                        bgcolor: colors.paper
                    }}
                >
                    {renderStepContent()}

                    <NavigationButtons
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </Paper>
            </Container>
        </Box>
    );
}

function DeployFlow() {
    return (
        <MainLayout>
            <DeployFlowContent />
        </MainLayout>
    );
}

export default DeployFlow;