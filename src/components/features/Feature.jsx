import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeProvider';

export default function Feature({ title, desc, icon, color }) {
  const { colors } = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        width: 320,
        flexShrink: 0,
        bgcolor: colors.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: alpha(color, 0.2),
          color: color,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${alpha(color, 0.3)}`,
          transition: 'all 0.3s ease',
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: colors.text,
          transition: 'color 0.3s ease',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colors.textSecondary,
          transition: 'color 0.3s ease',
        }}
      >
        {desc}
      </Typography>
    </Paper>
  );
}
