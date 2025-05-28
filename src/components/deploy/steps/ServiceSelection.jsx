'use client';
import React from 'react';
import { Box } from '@mui/material';
import ScrollableSection from '@/components/common/ScrollableSection';
import ServiceCard from '../ServiceCard';

const ServiceSelection = ({ deployConfig, updateConfig, services }) => {
    return (
        <Box>
            {services.map((category) => (
                <ScrollableSection
                    key={category.id}
                    title={category.name}
                    gap={3}
                    containerSx={{ mb: 4 }}
                    headerSx={{ mb: 2 }}
                >
                    {category.items.map((service) => (
                        <ServiceCard
                            key={service.name}
                            service={service}
                            isSelected={deployConfig.service === service.name}
                            onSelect={() => updateConfig('service', service.name)}
                        />
                    ))}
                </ScrollableSection>
            ))}
        </Box>
    );
};

export default ServiceSelection;
