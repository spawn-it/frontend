'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Stack,
  Button
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Check as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeProvider';

const ServiceCard = ({
  service,
  serviceTypes,
  onToggleStatus,
  onApplyTerraform,
  onDestroyService
}) => {
  const { colors, isDarkMode } = useTheme();
  
  const getType = id => serviceTypes.find(t => t.id === id) || serviceTypes[3];
  const cfg = getType(service.type);
  const isRunning = service.status === 'running';
  const hasDrift = service.terraformState === 'drift';

  const buttonStyle = {
    opacity: 0.9,
    textTransform: 'none',
    borderRadius: 2,
    transition: 'all 0.3s',
    ':hover': { 
      opacity: 1,
      transform: 'translateY(-2px)',
      boxShadow: colors.shadow
    },
  };

  return (
    <Card sx={{ 
      width: 320, 
      borderRadius: 2,
      bgcolor: colors.paper,
      backdropFilter: 'blur(8px)',
      border: `1px solid ${colors.border}`,
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: colors.shadow,
        bgcolor: colors.paperHover
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia 
          component="img" 
          height="160" 
          image={cfg.image} 
          alt={service.name} 
          sx={{ 
            opacity: 0.85,
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.5s ease',
            '&:hover': {
              filter: 'brightness(1.2)'
            }
          }} 
        />
        <Box sx={{ position: 'absolute', top:12, right:12, zIndex:1 }}>
          <Avatar sx={{ 
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', 
            backdropFilter: 'blur(8px)',
            color: cfg.color === 'success' ? '#4caf50' : 
                   cfg.color === 'warning' ? '#ff9800' :
                   cfg.color === 'info' ? '#2196f3' : '#9c27b0',
            width:42, 
            height:42, 
            boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
            border: `1px solid ${colors.border}`
          }}>
            {cfg.icon}
          </Avatar>
        </Box>
        <Box sx={{ position:'absolute', bottom:12, left:12, zIndex:1 }}>
          <Chip
            avatar={<Avatar sx={{ 
              width:8, 
              height:8, 
              bgcolor: isRunning ? '#4caf50' : colors.textMuted,
              animation: isRunning ? 'pulse 2s infinite' : 'none'
            }} />}
            label={isRunning ? 'Online' : 'Offline'}
            size="small"
            sx={{ 
              bgcolor: colors.chipBg, 
              backdropFilter: 'blur(8px)',
              color: colors.text, 
              border: `1px solid ${colors.border}`,
              '.MuiChip-avatar': { 
                animation: isRunning ? 'pulse 2s infinite' : 'none' 
              } 
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ pb:1, color: colors.text }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', mb:1 }}>
          <Box>
            <Typography variant="h6" noWrap sx={{ color: colors.text, fontWeight: 'bold' }}>
              {service.name}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              {cfg.name}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" sx={{ color: colors.textMuted }}>
              Region
            </Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ color: colors.textSecondary }}>
              {service.region}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={hasDrift ? <WarningIcon /> : <CheckIcon />}
          label={hasDrift ? 'State Drift' : 'Terraform Compliant'}
          variant="outlined"
          sx={{ 
            mb:2,
            bgcolor: hasDrift ? 'rgba(255,152,0,0.1)' : 'rgba(76,175,80,0.1)',
            borderColor: hasDrift ? 'rgba(255,152,0,0.3)' : 'rgba(76,175,80,0.3)',
            color: hasDrift ? '#ff9800' : '#4caf50'
          }}
        />

        <Grid container spacing={2} sx={{ mb:2 }}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: colors.textMuted }}>
              Last Action
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              {service.lastAction}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: colors.textMuted }}>
              Last Update
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              {service.lastUpdate}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ px:2, pb:2 }}>
        <Stack direction="row" spacing={1} width="100%">
          {hasDrift && (
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white'
              }}
              onClick={e => { e.stopPropagation(); onApplyTerraform(service.id); }}
            >
              Apply Changes
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
            fullWidth
            sx={{
              ...buttonStyle,
              background: isRunning 
                ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white'
            }}
            onClick={e => { e.stopPropagation(); onToggleStatus(service.id); }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          {!isRunning && (
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                color: 'white'
              }}
              onClick={e => { e.stopPropagation(); onDestroyService(service.id); }}
            >
              Destroy
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;