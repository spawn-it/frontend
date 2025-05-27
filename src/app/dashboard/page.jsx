'use client';
import React, { useState } from 'react';
import { Container } from '@mui/material';
import MainLayout from '../../layouts/MainLayout';
import {
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';

import StatsCardList from '@/components/dashboard/StatsCardList';
import SearchAndFilters from '@/components/dashboard/SearchAndFilters';
import ServiceCardList from '@/components/dashboard/ServiceCardList';
import { useTheme } from '@/context/ThemeProvider';
import { Box } from '@mui/material';

// Types de services
const serviceTypes = [
  { id: 'minecraft', name: 'Minecraft Server', icon: <MemoryIcon />, color: 'success', image: 'https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png' },
  { id: 'quake', name: 'QuakeJS Server', icon: <StorageIcon />, color: 'warning', image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Quake_idSoftwareNightdiveStudios_S1_2560x1440-b31ed6ea4d89261b0556846ffd842d67?resize=1&w=480&h=270&quality=medium' },
  { id: 'wordpress', name: 'WordPress', icon: <LanguageIcon />, color: 'info', image: 'https://www.wppourlesnuls.com/wp-content/uploads/2019/08/WordPress-logotype-alternative-white.png' },
  { id: 'generic', name: 'Custom Server', icon: <CodeIcon />, color: 'secondary', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop' },
];

// Données simulées
const mockServices = [
  { id: 1, name: 'My Minecraft Server', type: 'minecraft', status: 'running', terraformState: 'compliant', lastAction: 'apply', machineStatus: 'online', region: 'eu-central-1', created: '2025-04-15', lastUpdate: '2025-05-07' },
  { id: 2, name: 'QuakeJS Arena', type: 'quake', status: 'stopped', terraformState: 'drift', lastAction: 'plan', machineStatus: 'stopped', region: 'us-east-1', created: '2025-04-02', lastUpdate: '2025-04-28' },
  { id: 3, name: 'Blog Personal', type: 'wordpress', status: 'running', terraformState: 'compliant', lastAction: 'apply', machineStatus: 'online', region: 'eu-west-1', created: '2025-03-22', lastUpdate: '2025-05-06' }
];

// Config stats
const statConfigs = [
  { id: 'total', label: 'Total Services', icon: <SettingsIcon />, color: 'primary' },
  { id: 'running', label: 'Running Services', icon: <PlayArrowIcon />, color: 'success' },
  { id: 'compliant', label: 'Compliant State', icon: <CheckIcon />, color: 'success' },
  { id: 'drift', label: 'State Drift', icon: <WarningIcon />, color: 'warning' },
];

function HomeContent({ services, setServices, searchQuery, setSearchQuery, selectedType, setSelectedType }) {
  const { colors } = useTheme();

  const toggleServiceStatus = (id) => {
    setServices(services.map(s => s.id === id
      ? {
          ...s,
          status: s.status === 'running' ? 'stopped' : 'running',
          machineStatus: s.status === 'running' ? 'stopped' : 'online'
        }
      : s
    ));
  };

  const applyTerraform = (id) => {
    setServices(services.map(s => s.id === id
      ? { ...s, terraformState: 'compliant', lastAction: 'apply', lastUpdate: new Date().toISOString().split('T')[0] }
      : s
    ));
  };

  const destroyService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
    && (selectedType === 'all' || s.type === selectedType)
  );

  const stats = statConfigs.map(cfg => {
    let val = 0;
    switch (cfg.id) {
      case 'total': val = services.length; break;
      case 'running': val = services.filter(s => s.status === 'running').length; break;
      case 'compliant': val = services.filter(s => s.terraformState === 'compliant').length; break;
      case 'drift': val = services.filter(s => s.terraformState === 'drift').length; break;
      default: break;
    }
    return { ...cfg, value: val };
  });

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: colors.background, 
      color: colors.text, 
      transition: 'all 0.3s' 
    }}>


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
          services={filtered}
          serviceTypes={serviceTypes}
          onToggleStatus={toggleServiceStatus}
          onApplyTerraform={applyTerraform}
          onDestroyService={destroyService}
        />

      </Container>
    </Box>
  );
}

function Home() {
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  return (
    <MainLayout>
      <HomeContent
        services={services}
        setServices={setServices}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </MainLayout>
  );
}

export default Home;
