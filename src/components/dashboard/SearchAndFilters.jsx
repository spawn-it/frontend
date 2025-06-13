import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeProvider';
import { useRouter } from 'next/navigation';

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  serviceTypes,
}) => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const handleNewService = () => {
    router.push(`/deploy`);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        bgcolor: colors.paper,
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <TextField
          fullWidth
          placeholder="Search services..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: colors.text,
              '& fieldset': {
                borderColor: colors.inputBorder,
              },
              '&:hover fieldset': {
                borderColor: colors.inputBorderHover,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2196f3',
              },
              bgcolor: colors.inputBg,
            },
            '& .MuiInputBase-input::placeholder': {
              color: colors.textMuted,
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.textMuted }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={2}>
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            sx={{
              minWidth: 150,
              color: colors.text,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.inputBorder,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.inputBorderHover,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2196f3',
              },
              '& .MuiSvgIcon-root': {
                color: colors.textSecondary,
              },
              bgcolor: colors.inputBg,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: isDarkMode
                    ? 'rgba(30,30,30,0.95)'
                    : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.border}`,
                  '& .MuiMenuItem-root': {
                    color: colors.text,
                    '&:hover': {
                      bgcolor: colors.inputBg,
                    },
                  },
                },
              },
            }}
            variant="outlined"
          >
            <MenuItem value="all">All Services</MenuItem>
            {serviceTypes.map(t => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={handleNewService}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(33,150,243,0.4)',
              },
            }}
          >
            New Service
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SearchAndFilters;
