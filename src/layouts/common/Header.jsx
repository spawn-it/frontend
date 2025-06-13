'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Badge,
  Avatar,
  Button,
  Container,
  Toolbar,
  Switch,
  Stack,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@/context/ThemeProvider';

const AvatarSignedIn = ({ user, onLogout, onProfile, colors }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    onProfile();
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Box
            sx={{
              bgcolor: '#4caf50',
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        }
      >
        <Avatar
          onClick={handleClick}
          sx={{
            background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)',
            cursor: 'pointer',
          }}
        >
          {getInitials(user?.name || user?.preferred_username)}
        </Avatar>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            bgcolor: colors.paper,
            border: `1px solid ${colors.border}`,
            mt: 1,
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <MenuItem
          onClick={handleProfile}
          sx={{
            '&:hover': { bgcolor: colors.inputBg },
            color: colors.text,
          }}
        >
          <PersonIcon sx={{ mr: 1, color: colors.textSecondary }} />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ color: colors.text }}
            >
              {user?.name || user?.preferred_username}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': { bgcolor: colors.inputBg },
            color: colors.text,
          }}
        >
          <LogoutIcon sx={{ mr: 1, color: colors.textSecondary }} />
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  );
};

const AvatarSignedOut = ({ isDarkMode, onLogin }) => (
  <Button
    variant="contained"
    color="primary"
    disableElevation
    onClick={onLogin}
    sx={{
      background: isDarkMode
        ? 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)'
        : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      color: 'white',
      textTransform: 'none',
      px: 3,
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(33,150,243,0.4)',
      },
    }}
  >
    Se connecter
  </Button>
);

const Header = ({ menuItems }) => {
  const { colors, isDarkMode, toggleDarkMode, mounted } = useTheme();
  const { keycloak, initialized } = useKeycloak();
  const router = useRouter();

  const handleLogin = () => {
    keycloak?.login();
  };

  const handleLogout = () => {
    keycloak?.logout();
  };

  const handleProfile = () => {
    const userId =
      keycloak?.tokenParsed?.sub || keycloak?.tokenParsed?.preferred_username;
    if (userId) {
      router.push(`/dashboard/${userId}`);
    }
  };

  if (!initialized) {
    return (
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: colors.navbar,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colors.navbarBorder}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
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
            <Box>Chargement...</Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  const isAuthenticated = keycloak?.authenticated;
  const user = keycloak?.tokenParsed;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: colors.navbar,
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.navbarBorder}`,
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" passHref>
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
          </Link>

          {/* Navigation + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Navigation Links */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 4,
              }}
            >
              {menuItems &&
                menuItems.map(item => (
                  <Button
                    key={item.label}
                    href={item.href}
                    color="inherit"
                    sx={{
                      color: colors.textSecondary,
                      textTransform: 'none',
                      '&:hover': {
                        color: colors.text,
                        bgcolor: colors.inputBg,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
            </Box>

            {/* Theme Toggle */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {mounted ? (
                  <>
                    <LightModeIcon
                      sx={{ color: colors.textMuted, fontSize: 18 }}
                    />
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
                        },
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#fff',
                        },
                      }}
                    />
                    <DarkModeIcon
                      sx={{ color: colors.textMuted, fontSize: 18 }}
                    />
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      width: '80px',
                      height: '32px',
                    }}
                  >
                    <LightModeIcon sx={{ color: '#999999', fontSize: 18 }} />
                    <Switch
                      checked={false}
                      size="small"
                      disabled
                      sx={{
                        '& .MuiSwitch-track': {
                          backgroundColor: '#ccc',
                        },
                        '& .MuiSwitch-thumb': {
                          backgroundColor: '#fff',
                        },
                      }}
                    />
                    <DarkModeIcon sx={{ color: '#999999', fontSize: 18 }} />
                  </Box>
                )}
              </Box>

              {/* Authentication Button/Avatar */}
              {isAuthenticated ? (
                <AvatarSignedIn
                  user={user}
                  onLogout={handleLogout}
                  onProfile={handleProfile}
                  colors={colors}
                />
              ) : (
                <AvatarSignedOut
                  isDarkMode={isDarkMode}
                  onLogin={handleLogin}
                />
              )}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
