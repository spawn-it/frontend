'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Container, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Stack, 
  Button, 
  AppBar, 
  Toolbar, 
  Avatar, 
  TextField, 
  Select, 
  MenuItem, 
  IconButton,
  Chip,
  Divider,
  Badge,
  InputAdornment,
  useTheme,
  alpha,
  Switch
} from '@mui/material';
import { 
  Add as AddIcon, 
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Memory as MemoryIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

// Types de services
const serviceTypes = [
  { id: 'minecraft', name: 'Minecraft Server', icon: <MemoryIcon />, color: 'success', image: 'https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png' },
  { id: 'quake',     name: 'QuakeJS Server',     icon: <StorageIcon />, color: 'warning', image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Quake_idSoftwareNightdiveStudios_S1_2560x1440-b31ed6ea4d89261b0556846ffd842d67?resize=1&w=480&h=270&quality=medium' },
  { id: 'wordpress', name: 'WordPress',          icon: <LanguageIcon />, color: 'info', image: 'https://www.wppourlesnuls.com/wp-content/uploads/2019/08/WordPress-logotype-alternative-white.png' },
  { id: 'generic',   name: 'Custom Server',       icon: <CodeIcon />,    color: 'secondary', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop' },
];

// Données simulées
const mockServices = [
  { id: 1, name: 'My Minecraft Server', type: 'minecraft', status: 'running', terraformState: 'compliant', lastAction: 'apply', machineStatus: 'online', region: 'eu-central-1', created: '2025-04-15', lastUpdate: '2025-05-07' },
  { id: 2, name: 'QuakeJS Arena',       type: 'quake',     status: 'stopped', terraformState: 'drift',     lastAction: 'plan',  machineStatus: 'stopped', region: 'us-east-1',  created: '2025-04-02', lastUpdate: '2025-04-28' },
  { id: 3, name: 'Blog Personal',        type: 'wordpress', status: 'running', terraformState: 'compliant', lastAction: 'apply', machineStatus: 'online', region: 'eu-west-1',  created: '2025-03-22', lastUpdate: '2025-05-06' }
];

// Config stats
const statConfigs = [
  { id: 'total',     label: 'Total Services',    icon: <SettingsIcon />, color: 'primary' },
  { id: 'running',   label: 'Running Services',  icon: <PlayArrowIcon />, color: 'success' },
  { id: 'compliant', label: 'Compliant State',   icon: <CheckIcon />,    color: 'success' },
  { id: 'drift',     label: 'State Drift',       icon: <WarningIcon />,  color: 'warning' },
];

function Home() {
  const theme = useTheme();
  const [services, setServices] = useState(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Thèmes dynamiques
  const currentTheme = {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    paper: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)',
    paperHover: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,1)',
    text: isDarkMode ? 'white' : '#1a1a1a',
    textSecondary: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    textMuted: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    navbar: isDarkMode ? alpha('#0f2027', 0.85) : 'rgba(255,255,255,0.85)',
    navbarBorder: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    inputBg: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    inputBorder: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
    inputBorderHover: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
    chipBg: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
    shadow: isDarkMode ? '0 16px 30px rgba(0,0,0,0.4)' : '0 16px 30px rgba(0,0,0,0.15)'
  };

  // Styles partagés pour tous les boutons
  const buttonStyle = {
    opacity: 0.9,
    textTransform: 'none',
    borderRadius: 2,
    transition: 'all 0.3s',
    ':hover': { 
      opacity: 1,
      transform: 'translateY(-2px)',
      boxShadow: currentTheme.shadow
    },
  };

  // CRUD services
  const toggleServiceStatus = (id) => {
    setServices(services.map(s => s.id === id
      ? {
          ...s,
          status: s.status === 'running' ? 'stopped' : 'running',
          machineStatus: s.status === 'running' ? 'stopped' : 'online'
        }
      : s
    ));
  };
  const applyTerraform = (id) => {
    setServices(services.map(s => s.id === id
      ? { ...s, terraformState: 'compliant', lastAction: 'apply', lastUpdate: new Date().toISOString().split('T')[0] }
      : s
    ));
  };
  const destroyService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  // Filtrage + stats
  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
    && (selectedType === 'all' || s.type === selectedType)
  );
  const stats = statConfigs.map(cfg => {
    let val = 0;
    switch (cfg.id) {
      case 'total':     val = services.length; break;
      case 'running':   val = services.filter(s => s.status === 'running').length; break;
      case 'compliant': val = services.filter(s => s.terraformState === 'compliant').length; break;
      case 'drift':     val = services.filter(s => s.terraformState === 'drift').length; break;
      default: break;
    }
    return { ...cfg, value: val };
  });

  const getType = id => serviceTypes.find(t => t.id === id) || serviceTypes[3];

  // Carte service
  const ServiceCard = ({ svc }) => {
    const cfg = getType(svc.type);
    const isRunning = svc.status === 'running';
    const hasDrift = svc.terraformState === 'drift';
    return (
      <Card sx={{ 
        width: 320, 
        borderRadius: 2,
        bgcolor: currentTheme.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${currentTheme.border}`,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: currentTheme.shadow,
          bgcolor: currentTheme.paperHover
        }
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia 
            component="img" 
            height="160" 
            image={cfg.image} 
            alt={svc.name} 
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
              border: `1px solid ${currentTheme.border}`
            }}>
              {cfg.icon}
            </Avatar>
          </Box>
          <Box sx={{ position:'absolute', bottom:12, left:12, zIndex:1 }}>
            <Chip
              avatar={<Avatar sx={{ 
                width:8, 
                height:8, 
                bgcolor: isRunning ? '#4caf50' : currentTheme.textMuted,
                animation: isRunning ? 'pulse 2s infinite' : 'none'
              }} />}
              label={isRunning ? 'Online' : 'Offline'}
              size="small"
              sx={{ 
                bgcolor: currentTheme.chipBg, 
                backdropFilter: 'blur(8px)',
                color: currentTheme.text, 
                border: `1px solid ${currentTheme.border}`,
                '.MuiChip-avatar': { 
                  animation: isRunning ? 'pulse 2s infinite' : 'none' 
                } 
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ pb:1, color: currentTheme.text }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', mb:1 }}>
            <Box>
              <Typography variant="h6" noWrap sx={{ color: currentTheme.text, fontWeight: 'bold' }}>
                {svc.name}
              </Typography>
              <Typography variant="body2" sx={{ color: currentTheme.textSecondary }}>
                {cfg.name}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" sx={{ color: currentTheme.textMuted }}>
                Region
              </Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ color: currentTheme.textSecondary }}>
                {svc.region}
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
              <Typography variant="caption" sx={{ color: currentTheme.textMuted }}>
                Last Action
              </Typography>
              <Typography variant="body2" sx={{ color: currentTheme.textSecondary }}>
                {svc.lastAction}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: currentTheme.textMuted }}>
                Last Update
              </Typography>
              <Typography variant="body2" sx={{ color: currentTheme.textSecondary }}>
                {svc.lastUpdate}
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
                onClick={e => { e.stopPropagation(); applyTerraform(svc.id); }}
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
              onClick={e => { e.stopPropagation(); toggleServiceStatus(svc.id); }}
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
                onClick={e => { e.stopPropagation(); destroyService(svc.id); }}
              >
                Destroy
              </Button>
            )}
          </Stack>
        </CardActions>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight:'100vh', background: currentTheme.background, color: currentTheme.text, transition: 'all 0.3s' }}>
      {/* Navigation avec toggle */}
      <AppBar position="fixed" elevation={0} sx={{ 
        backgroundColor: currentTheme.navbar, 
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${currentTheme.navbarBorder}`
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 1,
                background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)'
              }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: currentTheme.text }}>
                  SpawnIt Dashboard
                </Typography>
                <Typography variant="caption" sx={{ color: currentTheme.textMuted }}>
                  Powered by OpenTofu/Terraform
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Toggle Dark/Light Mode */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightModeIcon sx={{ color: currentTheme.textMuted, fontSize: 20 }} />
                <Switch
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: isDarkMode ? '#4caf50' : '#ccc',
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#fff',
                    }
                  }}
                />
                <DarkModeIcon sx={{ color: currentTheme.textMuted, fontSize: 20 }} />
              </Box>
              
              <Button 
                startIcon={<RefreshIcon />} 
                variant="outlined" 
                size="small"
                sx={{
                  borderColor: currentTheme.inputBorder,
                  color: currentTheme.textSecondary,
                  '&:hover': {
                    borderColor: currentTheme.inputBorderHover,
                    bgcolor: currentTheme.inputBg
                  }
                }}
              >
                Refresh State
              </Button>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
                badgeContent={<Box sx={{ bgcolor:'#4caf50', width:10, height:10, borderRadius:'50%', border:'2px solid white' }}/>}
              >
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: `2px solid ${currentTheme.border}`
                }}>
                  A
                </Avatar>
              </Badge>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenu principal avec padding pour compenser l'AppBar fixe */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        {/* Stats */}
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
          {stats.map(stat => (
            <Paper
              key={stat.id}
              elevation={0}
              sx={{
                flex: 1,
                minWidth: 200,
                p: 3,
                borderRadius: 2,
                bgcolor: currentTheme.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${currentTheme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: currentTheme.shadow,
                  bgcolor: currentTheme.paperHover
                }
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: currentTheme.textMuted }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: currentTheme.text }}>
                  {stat.value}
                </Typography>
              </Box>
              <Avatar sx={{
                bgcolor: alpha(
                  stat.color === 'warning' ? '#ff9800' :
                  stat.color === 'success' ? '#4caf50' :
                  '#2196f3'
                , 0.2),
                color:
                  stat.color === 'warning' ? '#ff9800' :
                  stat.color === 'success' ? '#4caf50' :
                  '#2196f3',
                width: 56,
                height: 56,
                border: `2px solid ${
                  stat.color === 'warning' ? 'rgba(255,152,0,0.3)' :
                  stat.color === 'success' ? 'rgba(76,175,80,0.3)' :
                  'rgba(33,150,243,0.3)'
                }`
              }}>
                {stat.icon}
              </Avatar>
            </Paper>
          ))}
        </Box>

        {/* Recherche & déploiement */}
        <Paper
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: currentTheme.paper,
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <Box display="flex" flexDirection={{ xs:'column', md:'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: currentTheme.text,
                  '& fieldset': {
                    borderColor: currentTheme.inputBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: currentTheme.inputBorderHover,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                  bgcolor: currentTheme.inputBg
                },
                '& .MuiInputBase-input::placeholder': {
                  color: currentTheme.textMuted,
                  opacity: 1
                }
              }}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: currentTheme.textMuted }}/>
                  </InputAdornment>
                ) 
              }}
            />
            <Stack direction="row" spacing={2}>
              <Select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)} 
                sx={{ 
                  minWidth: 150,
                  color: currentTheme.text,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentTheme.inputBorder,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: currentTheme.inputBorderHover,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3',
                  },
                  '& .MuiSvgIcon-root': {
                    color: currentTheme.textSecondary,
                  },
                  bgcolor: currentTheme.inputBg
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${currentTheme.border}`,
                      '& .MuiMenuItem-root': {
                        color: currentTheme.text,
                        '&:hover': {
                          bgcolor: currentTheme.inputBg
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem value="all">All Services</MenuItem>
                {serviceTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </Select>
              <Button  
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(33,150,243,0.4)'
                  }
                }}
              >
                New Service
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Cartes services */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: currentTheme.text }}>
              Active Services
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                size="small" 
                sx={{ 
                  border: 1, 
                  borderColor: currentTheme.border,
                  color: currentTheme.textSecondary,
                  '&:hover': {
                    borderColor: currentTheme.inputBorderHover,
                    bgcolor: currentTheme.inputBg
                  }
                }}
              >
                <ArrowBackIcon/>
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  border: 1, 
                  borderColor: currentTheme.border,
                  color: currentTheme.textSecondary,
                  '&:hover': {
                    borderColor: currentTheme.inputBorderHover,
                    bgcolor: currentTheme.inputBg
                  }
                }}
              >
                <ArrowForwardIcon/>
              </IconButton>
            </Stack>
          </Box>
          <Box display="flex" gap={3} flexWrap="wrap">
            {filtered.map(svc => <ServiceCard key={svc.id} svc={svc}/>)}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;