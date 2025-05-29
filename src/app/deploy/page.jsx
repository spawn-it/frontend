'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Paper, CircularProgress } from '@mui/material';
import MainLayout from '@/layouts/MainLayout';
import { useTheme } from '@/context/ThemeProvider';

import DeployHeader from '@/components/deploy/DeployHeader';
import DeploySteps from '@/components/deploy/DeploySteps';
import ServiceSelection from '@/components/deploy/steps/ServiceSelection';
import ProviderSelection from '@/components/deploy/steps/ProviderSelection';
import ServiceDetails from '@/components/deploy/steps/ServiceDetails';
import ReviewConfiguration from '@/components/deploy/steps/ReviewConfiguration';
import NavigationButtons from '@/components/deploy/NavigationButtons';

import { steps, infrastructureProviders } from '@/data/deployData';
import { getCatalog } from '@/services/catalogService';
import { getTemplate } from '@/services/templateService';

function DeployFlowContent() {
    const { colors } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedServiceName = searchParams.get('service');

    const [currentStep, setCurrentStep] = useState(0);
    const [deployConfig, setDeployConfig] = useState({});
    const [availableServices, setAvailableServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleFinish = () => {
        localStorage.setItem('deployConfig', JSON.stringify(deployConfig));
        router.push('/deploy/apply');
    };

    useEffect(() => {
        getCatalog()
            .then(async (services) => {
                setAvailableServices(services);

                if (selectedServiceName) {
                    const found = services.flatMap(category => category.items)
                        .find(s => s.name.toLowerCase() === selectedServiceName.toLowerCase());

                    if (found) {
                        try {
                            const template = await getTemplate(found.template_file);
                            setDeployConfig({
                                ...template.instance,
                                service: found.name
                            });
                        } catch (error) {
                            console.error('Erreur lors du chargement du template:', error);
                            setDeployConfig({ service: found.name });
                        }
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedServiceName]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const updateConfig = (key, value) => {
        setDeployConfig(prev => ({ ...prev, [key]: value }));
        if (key === 'service') {
            router.push(`/deploy?service=${value}`);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <ServiceSelection deployConfig={deployConfig} updateConfig={updateConfig} services={availableServices} />;
            case 1:
                return <ProviderSelection deployConfig={deployConfig} updateConfig={updateConfig} />;
            case 2:
                return <ServiceDetails deployConfig={deployConfig} updateConfig={updateConfig} />;
            case 3:
                return <ReviewConfiguration deployConfig={deployConfig} services={availableServices} providers={infrastructureProviders} />;
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
            <DeployHeader deployConfig={deployConfig} services={availableServices} />
            <DeploySteps steps={steps} currentStep={currentStep} />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={0} sx={{
                    p: 4,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                    bgcolor: colors.paper
                }}>
                    {renderStepContent()}
                    <NavigationButtons
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onFinish={handleFinish}
                    />

                </Paper>
            </Container>
        </Box>
    );
}

// Composant de fallback pour le loading
function DeployFlowFallback() {
    const { colors } = useTheme();

    return (
        <Box sx={{
            minHeight: '100vh',
            background: colors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <CircularProgress />
        </Box>
    );
}

// Composant principal avec Suspense
export default function DeployFlow() {
    return (
        <MainLayout>
            <Suspense fallback={<DeployFlowFallback />}>
                <DeployFlowContent />
            </Suspense>
        </MainLayout>
    );
}