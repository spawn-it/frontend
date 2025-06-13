import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function StatsCard({ stat, colors }) {
  return (
    <Paper
      key={stat.id}
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 200,
        p: 3,
        borderRadius: 2,
        bgcolor: colors.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: colors.textMuted }}>
          {stat.label}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color: colors.text }}>
          {stat.value}
        </Typography>
      </Box>
      <Avatar
        sx={{
          bgcolor: alpha(
            stat.color === 'warning'
              ? '#ff9800'
              : stat.color === 'success'
                ? '#4caf50'
                : '#2196f3',
            0.2
          ),
          color:
            stat.color === 'warning'
              ? '#ff9800'
              : stat.color === 'success'
                ? '#4caf50'
                : '#2196f3',
          width: 56,
          height: 56,
          border: `2px solid ${
            stat.color === 'warning'
              ? 'rgba(255,152,0,0.3)'
              : stat.color === 'success'
                ? 'rgba(76,175,80,0.3)'
                : 'rgba(33,150,243,0.3)'
          }`,
        }}
      >
        {stat.icon}
      </Avatar>
    </Paper>
  );
}
