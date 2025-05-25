'use client'
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '../../context/ThemeProvider';

export default function Testimonial({t}) {
  const { colors } = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        width: 384,
        flexShrink: 0,
        bgcolor: colors.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <img
          src={t.avatar}
          alt={t.name}
          width={48}
          height={48}
          style={{ 
            borderRadius: 24,
            border: `2px solid ${colors.border}`,
            transition: 'border-color 0.3s ease'
          }}
        />
        <Box>
          <Typography 
            variant="subtitle1" 
            fontWeight={600} 
            sx={{
              color: colors.text,
              transition: 'color 0.3s ease'
            }}
          >
            {t.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: colors.textSecondary,
              transition: 'color 0.3s ease'
            }}
          >
            {t.role}
          </Typography>
        </Box>
      </Stack>
      <Typography 
        variant="body2" 
        fontStyle="italic"
        sx={{
          color: colors.text,
          opacity: 0.9,
          transition: 'color 0.3s ease',
          lineHeight: 1.6,
        }}
      >
        {t.content}
      </Typography>
    </Paper>
  );
}