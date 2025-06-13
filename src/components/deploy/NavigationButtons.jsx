import React from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@/context/ThemeProvider';

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onFinish,
}) => {
  const { colors } = useTheme();
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
      <Button
        variant="outlined"
        onClick={onPrev}
        disabled={isFirstStep}
        sx={{
          px: 4,
          borderColor: colors.border,
          color: colors.text,
          '&:hover': {
            borderColor: colors.inputBorderHover,
            bgcolor: colors.inputBg,
          },
          '&:disabled': {
            borderColor: colors.border,
            color: colors.textMuted,
          },
        }}
      >
        Précédent
      </Button>

      <Button
        variant="contained"
        onClick={isLastStep ? onFinish : onNext}
        sx={{
          px: 4,
          bgcolor: isLastStep ? '#4caf50' : '#1976d2',
          color: 'white',
          '&:hover': {
            bgcolor: isLastStep ? '#45a049' : '#1565c0',
          },
        }}
      >
        {isLastStep ? 'Déployer le Service' : 'Suivant'}
      </Button>
    </Box>
  );
};

export default NavigationButtons;
