'use client';
import React, { useEffect, useState, Suspense, useRef } from 'react';
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

const encodeConfig = (config) => {
    try {
        return btoa(JSON.stringify(config));
    } catch {
        return '';
    }
};

const decodeConfig = (encoded) => {
    try {
        return JSON.parse(atob(encoded));
    } catch {
        return {};
    }
};

function DeployFlowContent() {
    const { colors } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedServiceName = searchParams.get('service');
    const encodedConfig = searchParams.get('config');
    const stepParam = parseInt(searchParams.get('step') || '0', 10);

    const [currentStep, setCurrentStep] = useState(0);
    const [deployConfig, setDeployConfig] = useState({});
    const [availableServices, setAvailableServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const lastLoadedService = useRef(null);

    // Effet pour l'initialisation uniquement
    useEffect(() => {
        const initialize = async () => {
            try {
                const services = await getCatalog();
                setAvailableServices(services);

                if (encodedConfig) {
                    const config = decodeConfig(encodedConfig);
                    setDeployConfig(config);
                    lastLoadedService.current = config.service;
                } else if (selectedServiceName) {
                    const found = services.flatMap(c => c.items).find(
                        s => s.name.toLowerCase() === selectedServiceName.toLowerCase()
                    );
                    if (found) {
                        try {
                            const template = await getTemplate(found.template_file);
                            setDeployConfig({
                                ...template.instance,
                                service: found.name
                            });
                            lastLoadedService.current = found.name;
                        } catch (err) {
                            console.error('Erreur template :', err);
                            setDeployConfig({ service: found.name });
                            lastLoadedService.current = found.name;
                        }
                    }
                }

                if (!isNaN(stepParam) && stepParam >= 0 && stepParam < steps.length) {
                    setCurrentStep(stepParam);
                }
            } catch (err) {
                console.error('Erreur catalogue :', err);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [selectedServiceName, encodedConfig, stepParam]);

    // Effet séparé pour surveiller les changements de service depuis l'URL
    useEffect(() => {
        if (!loading && selectedServiceName && availableServices.length > 0) {
            // Si le service dans l'URL est différent de celui actuellement chargé
            if (selectedServiceName.toLowerCase() !== lastLoadedService.current?.toLowerCase()) {
                const found = availableServices.flatMap(c => c.items).find(
                    s => s.name.toLowerCase() === selectedServiceName.toLowerCase()
                );

                if (found) {
                    const loadNewTemplate = async () => {
                        try {
                            const template = await getTemplate(found.template_file);
                            setDeployConfig(prev => ({
                                ...template.instance,
                                service: found.name,
                                // Préserver le provider s'il était déjà sélectionné
                                provider: prev.provider
                            }));
                            lastLoadedService.current = found.name;
                        } catch (err) {
                            console.error('Erreur lors du chargement du template:', err);
                            setDeployConfig(prev => ({
                                ...prev,
                                service: found.name
                            }));
                            lastLoadedService.current = found.name;
                        }
                    };

                    loadNewTemplate();
                }
            }
        }
    }, [selectedServiceName, availableServices, loading]);

    // Effet pour charger le template quand le service change dans deployConfig (pas depuis l'URL)
    useEffect(() => {
        const loadServiceTemplate = async () => {
            if (
                availableServices.length > 0 &&
                deployConfig.service &&
                !loading &&
                deployConfig.service !== lastLoadedService.current &&
                deployConfig.service.toLowerCase() === selectedServiceName?.toLowerCase() // Éviter conflit avec l'effet précédent
            ) {
                const found = availableServices.flatMap(c => c.items).find(
                    s => s.name.toLowerCase() === deployConfig.service.toLowerCase()
                );

                if (found) {
                    try {
                        const template = await getTemplate(found.template_file);
                        setDeployConfig(prev => ({
                            ...template.instance,
                            service: found.name,
                            provider: prev.provider
                        }));
                        lastLoadedService.current = found.name;
                    } catch (err) {
                        console.error('Erreur lors du chargement du template:', err);
                    }
                }
            }
        };

        loadServiceTemplate();
    }, [deployConfig.service, availableServices, loading, selectedServiceName]);

    const updateURL = (config, step = currentStep) => {
        const params = new URLSearchParams();
        if (config.service) params.set('service', config.service);
        params.set('config', encodeConfig(config));
        if (step > 0) params.set('step', step.toString());
        router.replace(`/deploy?${params.toString()}`, { shallow: true });
    };

    const updateConfig = (key, value) => {
        const newConfig = { ...deployConfig, [key]: value };
        setDeployConfig(newConfig);
        updateURL(newConfig);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            updateURL(deployConfig, newStep);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            updateURL(deployConfig, newStep);
        }
    };

    const handleFinish = () => {
        router.push(`/deploy/apply?config=${encodeConfig(deployConfig)}`);
    };

    const renderStepContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            );
        }

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
                        deployConfig={deployConfig}
                    />
                </Paper>
            </Container>
        </Box>
    );
}

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

export default function DeployFlow() {
    return (
        <MainLayout>
            <Suspense fallback={<DeployFlowFallback />}>
                <DeployFlowContent />
            </Suspense>
        </MainLayout>
    );
}