import React from 'react';
import { Box } from '@mui/material';
import ScrollableSection from '@/components/common/ScrollableSection';
import ProviderCard from '../ProviderCard';
import { infrastructureProviders } from '@/data/deployData';

const ProviderSelection = ({ deployConfig, updateConfig }) => {
  return (
    <Box>
      <ScrollableSection
        title="Choisir le Fournisseur d'Infrastructure"
        subtitle="Sélectionnez où vous souhaitez déployer votre service"
        gap={3}
        containerSx={{ mb: 0 }}
        headerSx={{ mb: 4 }}
      >
        {infrastructureProviders.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isSelected={deployConfig.provider === provider.id}
            onSelect={() => updateConfig('provider', provider.id)}
          />
        ))}
      </ScrollableSection>
    </Box>
  );
};

export default ProviderSelection;
