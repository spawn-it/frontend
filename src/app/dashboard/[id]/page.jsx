'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Box, CircularProgress, Backdrop, Typography } from '@mui/material';
import MainLayout from '../../../layouts/MainLayout';
import {
  Check as CheckIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import StatsCardList from '@/components/dashboard/StatsCardList';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import ServiceCardList from '@/components/dashboard/ServiceCardList';
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

function DashboardPage() {
  const hasMounted = useHasMounted();
  const { colors } = useTheme();
  const { keycloak, initialized } = useKeycloak();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

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
    if (!isAuthorized || !userId) return;

    const fetchServices = async () => {
      try {
        const data = await getClientServices(userId);
        const transformed = transformServices(data);
        setServices(transformed);
      } catch (err) {
        console.error('Erreur lors du fetch des services:', err);
      }
    };

    (async () => {
      await fetchServices();
    })();


    getCatalog()
        .then(catalog => {
          const types = extractServiceTypes(catalog);
          setServiceTypes(types);
        })
        .catch(console.error);

    const interval = setInterval(fetchServices, 5000);

    return () => clearInterval(interval);
  }, [isAuthorized, userId]);


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
      const data = await getClientServices(userId);
      const transformed = transformServices(data);
      setServices(transformed);
    } catch (err) {
      console.error(`Erreur lors de la suppression de ${id}:`, err);
    } finally {
      setLoading(false);
    }
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

  const filteredServices = services.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedType === 'all' || s.type === selectedType)
  );

  const statConfigs = [
    { id: 'total', label: 'Total Services', icon: <SettingsIcon />, color: 'primary' },
    { id: 'compliant', label: 'Compliant State', icon: <CheckIcon />, color: 'success' },
    { id: 'drift', label: 'State Drift', icon: <WarningIcon />, color: 'warning' },
  ];

  const stats = statConfigs.map(cfg => {
    let val = 0;
    switch (cfg.id) {
      case 'total': val = services.length; break;
      case 'compliant': val = services.filter(s => s.terraformState === 'compliant').length; break;
      case 'drift': val = services.filter(s => s.terraformState === 'drifted').length; break;
      default: break;
    }
    return { ...cfg, value: val };
  });

  return (
    <MainLayout>
      <Box sx={{ minHeight: '100vh', background: colors.background, color: colors.text }}>
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <StatsCardList stats={stats} colors={colors} />
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            serviceTypes={serviceTypes}
          />
          <ServiceCardList
            services={filteredServices}
            serviceTypes={serviceTypes}
            onApplyTerraform={applyTerraform}
            onDestroyService={handleDestroy}
            onDeleteService={handleDelete}
          />
        </Container>
        <Backdrop open={loading} sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>Traitement en cours…</Typography>
        </Backdrop>
      </Box>
    </MainLayout>
  );
}

export default DashboardPage;
