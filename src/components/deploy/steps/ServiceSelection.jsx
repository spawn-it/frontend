'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';
import ScrollableSection from '@/components/common/ScrollableSection';
import ServiceCard from '../ServiceCard';
import { availableServices } from '@/data/deployData';

const ServiceSelection = ({ deployConfig, updateConfig }) => {
    const { colors } = useTheme();

    return (
        <Box>
            <ScrollableSection
                title="Choisir le Type de Service"
                subtitle="Sélectionnez le service que vous souhaitez déployer"
                gap={3}
                containerSx={{ mb: 0 }}
                headerSx={{ mb: 4 }}
            >
                {availableServices.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={deployConfig.serviceType === service.id}
                        onSelect={() => updateConfig('serviceType', service.id)}
                    />
                ))}
            </ScrollableSection>
        </Box>
    );
};

export default ServiceSelection;