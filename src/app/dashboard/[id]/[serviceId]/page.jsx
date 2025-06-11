'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Box, CircularProgress, Typography, Grid, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MainLayout from '../../../../layouts/MainLayout';
import ServiceCard from '@/components/dashboard/ServiceCard';
import StreamViewer from '@/components/dashboard/StreamViewer';
import { useTheme } from '@/context/ThemeProvider';
import { useKeycloak } from '@react-keycloak/web';
import { getClientServices } from '@/services/clientService';
import { applyService, destroyService as apiDestroyService, deleteService } from '@/services/deployService';
import { getCatalog, extractServiceTypes } from '@/services/catalogService';

function useHasMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    return mounted;
}

function transformServices(rawData) {
    const servicesObj = rawData.services || {};

    return Object.entries(servicesObj)
        .filter(([_, svc]) => svc && typeof svc === 'object')
        .map(([id, svc]) => {
            const statusData = typeof svc.status === 'object' ? svc.status : {};
            const lastAction = svc.lastAction || 'unknown';
            const lastUpdate = svc.status?.timestamp.split('T')[0] || 'unknown';
            const isCompliant = lastAction === 'apply' && statusData.applied === true || lastAction === 'destroy' && statusData.applied === false;
            const terraformState = isCompliant ? 'compliant' : 'drifted';
            const isError = statusData.errorMessage !== null && statusData.errorMessage !== undefined;

            return {
                id,
                name: svc.serviceName,
                type: svc.serviceType?.toLowerCase() || 'unknown',
                terraformState,
                lastAction,
                lastUpdate,
                status: isError ? 'error' : 'stopped',
                region: 'unknown',
                created: '2025-01-01',
                provider: svc.provider || 'unknown',
                public_ip: typeof svc.applyOutput === 'object' && svc.applyOutput?.instance_public_ip_or_host || 'unknown',
                ports: Array.isArray(svc?.applyOutput?.all_ports_info)
                    ? svc.applyOutput.all_ports_info.map(p => `${p.internal}:${p.external}`).join(', ')
                    : 'N/A',
            };
        });
}

function ServiceDetailPage() {
    const hasMounted = useHasMounted();
    const { colors } = useTheme();
    const { keycloak, initialized } = useKeycloak();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;
    const serviceId = params.serviceId;

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [loading, setLoading] = useState(false);
    const [service, setService] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);

    useEffect(() => {
        if (!hasMounted || !initialized) return;

        if (!keycloak?.authenticated) {
            router.push('/');
            return;
        }

        if (keycloak.authenticated && userId) {
            const tokenUserId = keycloak.tokenParsed?.sub;
            setIsAuthorized(tokenUserId === userId);
            setCheckingAccess(false);
        }
    }, [hasMounted, initialized, keycloak, userId]);

    useEffect(() => {
        if (!isAuthorized || !userId || !serviceId) return;

        const fetchService = async () => {
            try {
                const data = await getClientServices(userId);
                const transformed = transformServices(data);
                const foundService = transformed.find(s => s.id === serviceId);
                setService(foundService);
            } catch (err) {
                console.error('Erreur lors du fetch du service:', err);
            }
        };

        fetchService();

        getCatalog()
            .then(catalog => {
                const types = extractServiceTypes(catalog);
                setServiceTypes(types);
            })
            .catch(console.error);

        const interval = setInterval(fetchService, 5000);
        return () => clearInterval(interval);
    }, [isAuthorized, userId, serviceId]);

    const applyTerraform = async (id) => {
        setLoading(true);
        try {
            await applyService(userId, id);
        } catch (err) {
            console.error(`Erreur lors de l'application de ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleDestroy = async (id) => {
        setLoading(true);
        try {
            await apiDestroyService(userId, id);
        } catch (err) {
            console.error(`Erreur lors de la destruction de ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteService(userId, id);
            router.push(`/dashboard/${userId}`);
        } catch (err) {
            console.error(`Erreur lors de la suppression de ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToDashboard = () => {
        router.push(`/dashboard/${userId}`);
    };

    if (!hasMounted) return null;

    if (checkingAccess) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (!isAuthorized) return null;

    if (!service) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ minHeight: '100vh', background: colors.background, color: colors.text }}>
                <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
                    {/* Header avec bouton retour */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: colors.text,
                                '&:hover': { color: colors.textSecondary }
                            }}
                            onClick={handleBackToDashboard}
                        >
                            <ArrowBackIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Retour au Dashboard
                            </Typography>
                        </Box>
                    </Box>

                    {/* Titre de la page */}
                    <Typography variant="h4" sx={{ mb: 4, color: colors.text, fontWeight: 'bold' }}>
                        Détails du Service: {service.name}
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Colonne de gauche - Service Card */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ServiceCard
                                    service={service}
                                    serviceTypes={serviceTypes}
                                    onApplyTerraform={applyTerraform}
                                    onDestroyService={handleDestroy}
                                    onDeleteService={handleDelete}
                                />
                            </Box>
                        </Grid>

                        {/* Colonne de droite - Stream Viewer */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper
                                sx={{
                                    p: 3,
                                    bgcolor: colors.paper,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 2,
                                    height: '600px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>
                                    Logs en temps réel
                                </Typography>
                                <StreamViewer
                                    clientId={userId}
                                    serviceId={serviceId}
                                    colors={colors}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </MainLayout>
    );
}

export default ServiceDetailPage;