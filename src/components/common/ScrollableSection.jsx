import React, { useRef } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '../../context/ThemeProvider';

const ScrollableSection = ({
  title,
  subtitle,
  children,
  showArrows = true,
  gap = 4,
  containerSx = {},
  scrollContainerSx = {},
  headerSx = {}
}) => {
  const { colors } = useTheme();
  const containerRef = useRef(null);

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left'
        ? -containerRef.current.offsetWidth * 0.8
        : containerRef.current.offsetWidth * 0.8;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ mb: 4, ...containerSx }}>
      {(title || showArrows) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            ...headerSx
          }}
        >
          <Box>
            {title && (
              <Typography
                variant="h5"
                component="h3"
                sx={{ 
                  fontWeight: 'bold', 
                  color: colors.text,
                  transition: 'color 0.3s ease'
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="h6"
                sx={{ 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {showArrows && (
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => scrollContainer('left')}
                sx={{
                  border: 1,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: colors.inputBorderHover,
                    bgcolor: colors.inputBg,
                    color: colors.text
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => scrollContainer('right')}
                sx={{
                  border: 1,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: colors.inputBorderHover,
                    bgcolor: colors.inputBg,
                    color: colors.text
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          gap,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          p: 1,
          // Masquer la scrollbar
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none', // Firefox
          ...scrollContainerSx
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ScrollableSection;