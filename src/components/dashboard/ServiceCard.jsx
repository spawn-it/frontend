'use client';
import React from 'react';
import {
  Card, CardContent, CardMedia, CardActions,
  Typography, Box, Avatar, Chip, Grid, Stack, Button
} from '@mui/material';
import {
  Check as CheckIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeProvider';

const ServiceCard = ({
                       service,
                       lastAction,
                       serviceTypes,
                       onApplyTerraform,
                       onDestroyService,
                       onDeleteService
                     }) => {
  const { colors } = useTheme();

  const currentAction = lastAction ?? service.lastAction;
  const getType = id => serviceTypes.find(t => t.id === id) || serviceTypes[3];
  const cfg = getType(service.type);
  const isError = service.status === 'error';
  const isCompliant = service.terraformState === 'compliant';
  const isDrifted = service.terraformState === 'drifted';

  const canDestroy = !isError && currentAction === 'apply';
  const buttonStyle = {
    opacity: 0.9,
    textTransform: 'none',
    borderRadius: 2,
    transition: 'all 0.3s'
  };

  return (
      <Card sx={{
        width: 320,
        borderRadius: 2,
        bgcolor: colors.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.3s'
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
              component="img"
              height="160"
              image={cfg?.image}
              alt={service.name}
              sx={{
                opacity: 0.85,
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.5s ease'
              }}
          />
          <Box sx={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1 }}>
            <Chip
                avatar={<Avatar sx={{
                  width: 8,
                  height: 8,
                  bgcolor: isError ? '#f44336' : isCompliant ? '#4caf50' : '#ff9800'
                }} />}
                label={isError ? 'Error' : isCompliant ? 'Compliant' : 'Drifted'}
                size="small"
                sx={{
                  bgcolor: colors.chipBg,
                  backdropFilter: 'blur(8px)',
                  color: colors.text,
                  border: `1px solid ${colors.border}`
                }}
            />
          </Box>
        </Box>

        <CardContent sx={{ pb: 1, color: colors.text }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="h6" noWrap sx={{ color: colors.text, fontWeight: 'bold' }}>
                {service.name}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {cfg?.name}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Button
                  onClick={() => onDeleteService(service.id)}
                  size="small"
                  sx={{ color: '#f44336' }}
                  startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          </Box>

          {isError ? (
              <Chip
                  icon={<WarningIcon />}
                  label="Terraform Error"
                  sx={{
                    mb: 2,
                    bgcolor: 'rgba(244,67,54,0.1)',
                    borderColor: 'rgba(244,67,54,0.3)',
                    color: '#f44336'
                  }}
              />
          ) : (
              <Chip
                  icon={isDrifted ? <WarningIcon /> : <CheckIcon />}
                  label={isDrifted ? 'State Drift' : 'Terraform Compliant'}
                  sx={{
                    mb: 2,
                    bgcolor: isDrifted ? 'rgba(255,152,0,0.1)' : 'rgba(76,175,80,0.1)',
                    borderColor: isDrifted ? 'rgba(255,152,0,0.3)' : 'rgba(76,175,80,0.3)',
                    color: isDrifted ? '#ff9800' : '#4caf50'
                  }}
              />
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid span={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: colors.textMuted }}>
                Last Action
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {currentAction}
              </Typography>
            </Grid>
              <Grid span={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: colors.textMuted }}>
                Last Update
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {service.lastUpdate}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        {(
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Stack direction="row" spacing={1} width="100%">
                {canDestroy && (
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{
                          ...buttonStyle,
                          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                          color: 'white'
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          onDestroyService(service.id);
                        }}
                    >
                      Destroy
                    </Button>
                )}
                {(
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{
                          ...buttonStyle,
                          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                          color: 'white'
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          onApplyTerraform(service.id);
                        }}
                    >
                      Apply
                    </Button>
                )}
              </Stack>
            </CardActions>
        )}
      </Card>
  );
};

export default ServiceCard;
