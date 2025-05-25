'use client'
import React from 'react';
import { Box } from '@mui/material';
import StatsCard from '@/components/dashboard/StatsCard';

export default function StatsCardList({ stats , colors }) {
    return (
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        {stats.map(stat => (
          <StatsCard stat={stat} key={stat.id} colors={colors} />
        ))}
      </Box>
    )
}