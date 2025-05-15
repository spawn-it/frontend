'use client'
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
  alpha
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
  Memory as MemoryIcon
} from '@mui/icons-material';

// Types de services
const serviceTypes = [
  { id: 'minecraft', name: 'Minecraft Server', icon: <MemoryIcon />, color: 'success', image: 'https://image.api.playstation.com/vulcan/ap/rnd/202407/0401/670c294ded3baf4fa11068db2ec6758c63f7daeb266a35a1.png' },
  { id: 'quake',     name: 'QuakeJS Server',     icon: <StorageIcon />, color: 'warning', image: 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_Quake_idSoftwareNightdiveStudios_S1_2560x1440-b31ed6ea4d89261b0556846ffd842d67?resize=1&w=480&h=270&quality=medium' },
  { id: 'wordpress', name: 'WordPress',          icon: <LanguageIcon />, color: 'info', image: 'https://www.wppourlesnuls.com/wp-content/uploads/2019/08/WordPress-logotype-alternative-white.png' },
  { id: 'generic',   name: 'Custom Server',       icon: <CodeIcon />,    color: 'secondary', image: '/api/placeholder/800/400' },
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

  // Styles partagés pour tous les boutons
  const buttonStyle = {
    opacity: 0.8,
    textTransform: 'none',
    ':hover': { opacity: 1 },
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
      <Card sx={{ width: 320, borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia component="img" height="160" image={cfg.image} alt={svc.name} sx={{ opacity: 0.85 }} />
          <Box sx={{ position: 'absolute', top:12, right:12, zIndex:1 }}>
            <Avatar sx={{ bgcolor: 'white', color: `${cfg.color}.main`, width:42, height:42, boxShadow:2 }}>
              {cfg.icon}
            </Avatar>
          </Box>
          <Box sx={{ position:'absolute', bottom:12, left:12, zIndex:1 }}>
            <Chip
              avatar={<Avatar sx={{ width:8, height:8, bgcolor: isRunning ? 'success.main' : 'text.disabled' }} />}
              label={isRunning ? 'Online' : 'Offline'}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.6)', color:'white', '.MuiChip-avatar': { animation: isRunning ? 'pulse 2s infinite' : 'none' } }}
            />
          </Box>
        </Box>

        <CardContent sx={{ pb:1 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', mb:1 }}>
            <Box>
              <Typography variant="h6" noWrap>{svc.name}</Typography>
              <Typography variant="body2" color="text.secondary">{cfg.name}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">Region</Typography>
              <Typography variant="body2" fontWeight="medium">{svc.region}</Typography>
            </Box>
          </Box>

          <Chip
            icon={hasDrift ? <WarningIcon /> : <CheckIcon />}
            label={hasDrift ? 'State Drift' : 'Terraform Compliant'}
            color={hasDrift ? 'warning' : 'success'}
            variant="outlined"
            sx={{ mb:2 }}
          />

          <Grid container spacing={2} sx={{ mb:2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Last Action</Typography>
              <Typography variant="body2">{svc.lastAction}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Last Update</Typography>
              <Typography variant="body2">{svc.lastUpdate}</Typography>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ px:2, pb:2 }}>
          <Stack direction="row" spacing={1} width="100%">
            {hasDrift && (
              <Button
                variant="contained"
                color="warning"
                size="small"
                fullWidth
                sx={buttonStyle}
                onClick={e => { e.stopPropagation(); applyTerraform(svc.id); }}
              >
                Apply Changes
              </Button>
            )}
            <Button
              variant="contained"
              color={isRunning ? 'error' : 'success'}
              size="small"
              startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
              fullWidth
              sx={buttonStyle}
              onClick={e => { e.stopPropagation(); toggleServiceStatus(svc.id); }}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            {!isRunning && (
              <Button
                variant="contained"
                color="error"
                size="small"
                fullWidth
                sx={buttonStyle}
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
    <Box sx={{ minHeight:'100vh', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor:'white' }}>
        <Toolbar>
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary">Infrastructure Dashboard</Typography>
                <Typography variant="caption" color="text.secondary">Powered by OpenTofu/Terraform</Typography>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button startIcon={<RefreshIcon />} variant="outlined" size="small">Refresh State</Button>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
                  badgeContent={<Box sx={{ bgcolor:'success.main', width:10, height:10, borderRadius:'50%', border:'2px solid white' }}/>}
                >
                  <Avatar sx={{ background:`linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, boxShadow:2 }}>A</Avatar>
                </Badge>
              </Stack>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py:4 }}>
        {/* Stats */}
        <Box display="flex" gap={2} mb={4}>
          {stats.map(stat => (
            <Paper
              key={stat.id}
              elevation={0}
              sx={{
                flex: 1,
                p:2,
                borderRadius:1,
                bgcolor:'white',
                border:'1px solid',
                borderColor:'divider',
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between'
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
              </Box>
              <Avatar sx={{
                bgcolor: alpha(
                  stat.color === 'warning' ? theme.palette.warning.main :
                  stat.color === 'success' ? theme.palette.success.main :
                  theme.palette.primary.main
                , 0.1),
                color:
                  stat.color === 'warning' ? theme.palette.warning.main :
                  stat.color === 'success' ? theme.palette.success.main :
                  theme.palette.primary.main,
              }}>
                {stat.icon}
              </Avatar>
            </Paper>
          ))}
        </Box>

        {/* Recherche & déploiement */}
        <Paper
         elevation={0} sx={{ p:3, mb:4, bgcolor:'white',                 
          borderRadius:1,
          border:'1px solid',
          borderColor:'divider'}}>
          <Box display="flex" flexDirection={{ xs:'column', md:'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action"/></InputAdornment> }}
            />
            <Stack direction="row" spacing={2}>
              <Select value={selectedType} onChange={e => setSelectedType(e.target.value)} sx={{ minWidth:150 }}>
                <MenuItem value="all">All Services</MenuItem>
                {serviceTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </Select>
              <Button  variant="contained" startIcon={<AddIcon />}>New Service</Button>
            </Stack>
          </Box>
        </Paper>

        {/* Cartes services */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">Active Services</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ border:1, borderColor:'divider' }}><ArrowBackIcon/></IconButton>
              <IconButton size="small" sx={{ border:1, borderColor:'divider' }}><ArrowForwardIcon/></IconButton>
            </Stack>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            {filtered.map(svc => <ServiceCard key={svc.id} svc={svc}/>)}
          </Box>
        </Box>

        {/* Activité récente */}
        <Paper elevation={2} sx={{ p:3, borderRadius:2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Activity</Typography>
          <Stack spacing={2} divider={<Divider flexItem />}>
            {services.map(svc => {
              const cfg = getType(svc.type);
              const col = cfg.color;
              return (
                <Box key={svc.id} display="flex" alignItems="flex-start" gap={2}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette[col].main,0.1), color: theme.palette[col].main }}>
                    {cfg.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      <strong>{svc.name}</strong> {svc.lastAction === 'apply' ? 'was updated' : 'had changes planned'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{svc.lastUpdate}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;
