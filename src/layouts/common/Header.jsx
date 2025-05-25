'use client';
import React from 'react';
import { 
  AppBar, 
  Box,
  Badge,
  Avatar,
  Button, 
  Container, 
  Toolbar, 
  Typography,
  Switch,
  Stack
} from '@mui/material';
import { 
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeProvider';

const AvatarSingedIn = () => (
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
    badgeContent={<Box sx={{ bgcolor:'#4caf50', width:10, height:10, borderRadius:'50%', border:'2px solid white' }}/>}
  >
    <Avatar sx={{ 
      background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      A
    </Avatar>
  </Badge>
);

const AvatarSignedOut = (isDarkMode) => (
  <Button
    variant="contained"
    color="primary"
    disableElevation
    sx={{
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)'
        : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      color: 'white',
      textTransform: 'none',
      px: 3,
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(33,150,243,0.4)'
      }
    }}
  >
    Sign In
  </Button> 
);

const Header = ({ signedIn = false, menuItems }) => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        backgroundColor: colors.navbar, 
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.navbarBorder}`,
        transition: 'all 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            component="img"
            sx={{
              width: 150,
              borderRadius: 1,
            }}
            src="/logo.svg"
            alt="SpawnIt Logo"
          />
          </Box>

          {/* Navigation + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              {menuItems && menuItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  color="inherit"
                  sx={{ 
                    color: colors.textSecondary, 
                    textTransform: 'none',
                    '&:hover': { 
                      color: colors.text,
                      bgcolor: colors.inputBg
                    } 
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Theme Toggle */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LightModeIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
                <Switch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  size="small"
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: isDarkMode ? '#4caf50' : '#ccc',
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
                <DarkModeIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
              </Box>

              {/* Sign In Button */}

              {signedIn ? <AvatarSingedIn /> : <AvatarSignedOut isDarkMode={isDarkMode} />}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;