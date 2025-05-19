'use client'
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Collapse,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Types de providers disponibles
const infrastructureProviders = [
  {
    id: 'docker',
    name: 'Docker',
    description: 'Déployer sur des conteneurs Docker',
    icon: '🐳',
    color: 'primary',
    image: '/api/placeholder/800/400'
  },
  {
    id: 'aws',
    name: 'AWS (EC2)',
    description: 'Déployer sur Amazon Web Services',
    icon: '☁️',
    color: 'warning',
    borderColor: 'border-orange-200',
    image: '/api/placeholder/800/400'
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Déployer sur Google Cloud Platform',
    icon: '🌩️',
    color: 'success',
    borderColor: 'border-green-200',
    image: '/api/placeholder/800/400'
  }
];

// Types de services disponibles
const availableServices = [
  {
    id: 'minecraft',
    name: 'Serveur Minecraft',
    description: 'Déployer des serveurs Minecraft évolutifs',
    icon: '🎮',
    color: 'success',
    image: '/api/placeholder/800/400'
  },
  {
    id: 'quake',
    name: 'QuakeJS',
    description: 'Serveurs Quake classiques basés sur le web',
    icon: '🕹️',
    color: 'warning',
    image: '/api/placeholder/800/400'
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Hébergement WordPress optimisé',
    icon: '📝',
    color: 'info',
    image: '/api/placeholder/800/400'
  }
];

// Options CPU
const availableCpuOptions = [
  { value: '0.5', label: '0.5 vCPU', price: 'Charges légères' },
  { value: '1', label: '1 vCPU', price: 'Charges standard' },
  { value: '2', label: '2 vCPU', price: 'Charges moyennes' },
  { value: '4', label: '4 vCPU', price: 'Charges lourdes' },
  { value: '8', label: '8 vCPU', price: 'Charges entreprise' }
];

// Options RAM
const availableRamOptions = [
  { value: '512', label: '512 MB', description: 'Applications minimales' },
  { value: '1024', label: '1 GB', description: 'Petites applications' },
  { value: '2048', label: '2 GB', description: 'Applications standard' },
  { value: '4096', label: '4 GB', description: 'Applications moyennes' },
  { value: '8192', label: '8 GB', description: 'Grandes applications' },
  { value: '16384', label: '16 GB', description: 'Applications entreprise' }
];

function DeployFlow() {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deployConfig, setDeployConfig] = useState({
    provider: '',
    serviceType: '',
    serviceName: '',
    cpu: '1',
    ram: '1024',
    disk: '10',
    hasVolume: false,
    volumeSize: '5',
    ports: [{ exposed: '80', internal: '80' }],
    envVars: [{ key: '', value: '' }]
  });

  const steps = [
    { number: 1, title: 'Choisir le Service', desc: 'Sélectionner le type de service' },
    { number: 2, title: 'Choisir le Provider', desc: 'Sélectionner l\'infrastructure' },
    { number: 3, title: 'Détails du Service', desc: 'Nommer votre service' },
    { number: 4, title: 'Ressources', desc: 'CPU, RAM et Disque' },
    { number: 5, title: 'Vérification', desc: 'Confirmer le déploiement' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const updateConfig = (key, value) => {
    setDeployConfig(prev => ({ ...prev, [key]: value }));
  };

  const addPort = () => {
    setDeployConfig(prev => ({
      ...prev,
      ports: [...prev.ports, { exposed: '', internal: '' }]
    }));
  };

  const updatePort = (index, field, value) => {
    const newPorts = [...deployConfig.ports];
    newPorts[index][field] = value;
    setDeployConfig(prev => ({ ...prev, ports: newPorts }));
  };

  const removePort = (index) => {
    if (deployConfig.ports.length > 1) {
      const newPorts = deployConfig.ports.filter((_, i) => i !== index);
      setDeployConfig(prev => ({ ...prev, ports: newPorts }));
    }
  };

  const addEnvVar = () => {
    setDeployConfig(prev => ({
      ...prev,
      envVars: [...prev.envVars, { key: '', value: '' }]
    }));
  };

  const updateEnvVar = (index, field, value) => {
    const newEnvVars = [...deployConfig.envVars];
    newEnvVars[index][field] = value;
    setDeployConfig(prev => ({ ...prev, envVars: newEnvVars }));
  };

  const removeEnvVar = (index) => {
    if (deployConfig.envVars.length > 1) {
      const newEnvVars = deployConfig.envVars.filter((_, i) => i !== index);
      setDeployConfig(prev => ({ ...prev, envVars: newEnvVars }));
    }
  };

  // Get selected service type
  const selectedService = availableServices.find(s => s.id === deployConfig.serviceType);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: alpha(theme.palette.primary.main, 0.03), pb: 6 }}>
      {/* Hero Header with Service Info */}
      {selectedService && (
        <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              inset: 0, 
              background: `linear-gradient(to bottom right, ${theme.palette[selectedService.color].light}, ${theme.palette[selectedService.color].main})`, 
              opacity: 0.9 
            }}
          />
          <Box 
            component="img" 
            src={selectedService.image} 
            alt={selectedService.name}
            sx={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              mixBlendMode: 'overlay' 
            }}
          />
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.2)' }} />
          <Box sx={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white' 
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>{selectedService.icon}</Typography>
              <Typography variant="h3" fontWeight="bold">{selectedService.name}</Typography>
              <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>{selectedService.description}</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Header */}
      {!selectedService && (
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">Déployer un Nouveau Service</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Suivez les étapes pour configurer le déploiement de votre service
            </Typography>
          </Container>
        </Box>
      )}

      {/* Progress Steps */}
      <Box sx={{ 
        bgcolor: selectedService ? 'rgba(255,255,255,0.95)' : 'white', 
        backdropFilter: selectedService ? 'blur(8px)' : 'none',
        borderBottom: 1, 
        borderColor: 'divider',
        position: selectedService ? 'sticky' : 'static',
        top: 0,
        zIndex: 10
      }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.number}>
                <StepLabel>
                  <Typography variant="body2" fontWeight="medium">{step.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{step.desc}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Box>

      {/* Form Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          {/* Step 1: Choose Service Type */}
          {currentStep === 0 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Choisir le Type de Service</Typography>
              <Grid container spacing={3}>
                {availableServices.map((service) => (
                  <Grid item xs={12} md={4} key={service.id}>
                    <Card 
                      onClick={() => updateConfig('serviceType', service.id)}
                      sx={{ 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        transform: deployConfig.serviceType === service.id ? 'translateY(-4px)' : 'none',
                        boxShadow: deployConfig.serviceType === service.id 
                          ? `0 12px 20px -10px ${alpha(theme.palette[service.color].main, 0.3)}`
                          : '0 2px 10px rgba(0,0,0,0.05)',
                        border: '2px solid',
                        borderColor: deployConfig.serviceType === service.id 
                          ? theme.palette[service.color].main 
                          : 'transparent',
                        cursor: 'pointer',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            inset: 0, 
                            background: `linear-gradient(to bottom right, ${theme.palette[service.color].light}, ${theme.palette[service.color].main})`, 
                            opacity: 0.9 
                          }}
                        />
                        <CardMedia
                          component="img"
                          height="140"
                          image={service.image}
                          alt={service.name}
                          sx={{ mixBlendMode: 'overlay' }}
                        />
                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.2)' }} />
                        <Box sx={{ 
                          position: 'absolute', 
                          inset: 0, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white' 
                        }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>{service.icon}</Typography>
                            <Typography variant="h6" fontWeight="bold">{service.name}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{service.description}</Typography>
                          </Box>
                        </Box>
                        {deployConfig.serviceType === service.id && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 12, 
                              right: 12, 
                              bgcolor: 'white', 
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 2
                            }}
                          >
                            <CheckCircleIcon color={service.color} />
                          </Box>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Step 2: Choose Provider - FLEX LAYOUT */}
          {currentStep === 1 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Choisir le Fournisseur d'Infrastructure</Typography>
              <Box sx={{ display: 'flex', gap: 3, overflow: 'auto', pb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                {infrastructureProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    onClick={() => updateConfig('provider', provider.id)}
                    sx={{ 
                      width: 280,
                      flexShrink: 0,
                      borderRadius: 3, 
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      transform: deployConfig.provider === provider.id ? 'translateY(-4px)' : 'none',
                      boxShadow: deployConfig.provider === provider.id 
                        ? `0 12px 20px -10px ${alpha(theme.palette[provider.color].main, 0.3)}`
                        : '0 2px 10px rgba(0,0,0,0.05)',
                      border: '2px solid',
                      borderColor: deployConfig.provider === provider.id 
                        ? theme.palette[provider.color].main 
                        : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 220 }}>
                      <CardMedia
                        component="img"
                        image={provider.image}
                        alt={provider.name}
                        sx={{ height: '100%' }}
                      />
                      <Box sx={{ 
                        position: 'absolute', 
                        inset: 0, 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        backdropFilter: 'blur(1px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" sx={{ mb: 2 }}>{provider.icon}</Typography>
                          <Typography variant="h6" fontWeight="bold" color="text.primary">{provider.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{provider.description}</Typography>
                        </Box>
                      </Box>
                      {deployConfig.provider === provider.id && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            bgcolor: 'white', 
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2
                          }}
                        >
                          <CheckCircleIcon color={provider.color} />
                        </Box>
                      )}
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Step 3: Service Details */}
          {currentStep === 2 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Détails du Service</Typography>
              <Box sx={{ maxWidth: 600 }}>
                <Box mb={3}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                    Nom du Service
                  </Typography>
                  <TextField
                    fullWidth
                    value={deployConfig.serviceName}
                    onChange={(e) => updateConfig('serviceName', e.target.value)}
                    placeholder="mon-super-service"
                    variant="outlined"
                    helperText="Utilisez des lettres minuscules, des chiffres et des tirets uniquement"
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Step 4: Resources */}
          {currentStep === 3 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Allocation des Ressources</Typography>
              <Box sx={{ maxWidth: 800 }}>
                {/* CPU Selection */}
                <Box mb={4}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                    CPU
                  </Typography>
                  <Grid container spacing={2}>
                    {availableCpuOptions.map((option) => (
                      <Grid item xs={12} sm={6} key={option.value}>
                        <Paper
                          onClick={() => updateConfig('cpu', option.value)}
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: deployConfig.cpu === option.value 
                              ? theme.palette.primary.main 
                              : theme.palette.divider,
                            bgcolor: deployConfig.cpu === option.value 
                              ? alpha(theme.palette.primary.main, 0.05)
                              : 'transparent'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">{option.label}</Typography>
                              <Typography variant="body2" color="text.secondary">{option.price}</Typography>
                            </Box>
                            {deployConfig.cpu === option.value && (
                              <CheckCircleIcon color="primary" />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* RAM Selection */}
                <Box mb={4}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                    RAM
                  </Typography>
                  <Grid container spacing={2}>
                    {availableRamOptions.map((option) => (
                      <Grid item xs={12} sm={6} key={option.value}>
                        <Paper
                          onClick={() => updateConfig('ram', option.value)}
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: deployConfig.ram === option.value 
                              ? theme.palette.primary.main 
                              : theme.palette.divider,
                            bgcolor: deployConfig.ram === option.value 
                              ? alpha(theme.palette.primary.main, 0.05)
                              : 'transparent'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">{option.label}</Typography>
                              <Typography variant="body2" color="text.secondary">{option.description}</Typography>
                            </Box>
                            {deployConfig.ram === option.value && (
                              <CheckCircleIcon color="primary" />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Disk Configuration */}
                <Box mb={4}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                    Stockage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">Disque:</Typography>
                      <TextField
                        type="number"
                        value={deployConfig.disk}
                        onChange={(e) => updateConfig('disk', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: 100 }}
                        InputProps={{ endAdornment: <Typography variant="body2" color="text.secondary">GB</Typography> }}
                      />
                    </Box>
                  </Box>
                  
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={deployConfig.hasVolume}
                        onChange={(e) => updateConfig('hasVolume', e.target.checked)}
                      />
                    } 
                    label="Ajouter un volume persistant"
                  />
                  
                  {deployConfig.hasVolume && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4, mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">Taille du volume:</Typography>
                      <TextField
                        type="number"
                        value={deployConfig.volumeSize}
                        onChange={(e) => updateConfig('volumeSize', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ width: 100 }}
                        InputProps={{ endAdornment: <Typography variant="body2" color="text.secondary">GB</Typography> }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Advanced Configuration Button */}
                <Divider sx={{ my: 3 }} />
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant="text"
                  color="primary"
                  sx={{ mb: 2 }}
                  endIcon={<ExpandMoreIcon sx={{ 
                    transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} />}
                >
                  {showAdvanced ? 'Masquer' : 'Afficher'} la configuration avancée
                </Button>

                {/* Advanced Configuration */}
                <Collapse in={showAdvanced}>
                  <Box sx={{ mt: 2, mb: 4 }}>
                    {/* Port Configuration */}
                    <Box mb={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">
                          Mappage des Ports
                        </Typography>
                        <Button 
                          startIcon={<AddIcon />}
                          variant="outlined"
                          size="small"
                          onClick={addPort}
                        >
                          Ajouter un Port
                        </Button>
                      </Box>
                      <Stack spacing={2}>
                        {deployConfig.ports.map((port, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                              value={port.exposed}
                              onChange={(e) => updatePort(index, 'exposed', e.target.value)}
                              placeholder="Port exposé"
                              variant="outlined"
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <ArrowForwardIcon color="disabled" />
                            <TextField
                              value={port.internal}
                              onChange={(e) => updatePort(index, 'internal', e.target.value)}
                              placeholder="Port conteneur"
                              variant="outlined"
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            {deployConfig.ports.length > 1 && (
                              <IconButton 
                                color="error" 
                                onClick={() => removePort(index)}
                                size="small"
                              >
                                <RemoveIcon />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* Environment Variables */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">
                          Variables d'Environnement
                        </Typography>
                        <Button 
                          startIcon={<AddIcon />}
                          variant="outlined"
                          size="small"
                          onClick={addEnvVar}
                        >
                          Ajouter une Variable
                        </Button>
                      </Box>
                      <Stack spacing={2}>
                        {deployConfig.envVars.map((envVar, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                              value={envVar.key}
                              onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                              placeholder="Nom de la variable"
                              variant="outlined"
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            <Typography variant="body1" color="text.secondary">=</Typography>
                            <TextField
                              value={envVar.value}
                              onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                              placeholder="Valeur"
                              variant="outlined"
                              size="small"
                              sx={{ flex: 1 }}
                            />
                            {deployConfig.envVars.length > 1 && (
                              <IconButton 
                                color="error" 
                                onClick={() => removeEnvVar(index)}
                                size="small"
                              >
                                <RemoveIcon />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </Box>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>Vérification de la Configuration</Typography>
              <Box sx={{ maxWidth: 600 }}>
                <Stack spacing={3} divider={<Divider />}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Type de Service</Typography>
                    <Typography variant="body1">
                      {availableServices.find(s => s.id === deployConfig.serviceType)?.name || 'Non sélectionné'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="overline" color="text.secondary">Fournisseur</Typography>
                    <Typography variant="body1">
                      {infrastructureProviders.find(p => p.id === deployConfig.provider)?.name || 'Non sélectionné'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="overline" color="text.secondary">Nom du Service</Typography>
                    <Typography variant="body1">{deployConfig.serviceName || 'Non défini'}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="overline" color="text.secondary">Ressources</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">CPU: {deployConfig.cpu} vCPU</Typography>
                      <Typography variant="body2">RAM: {deployConfig.ram} MB</Typography>
                      <Typography variant="body2">Disque: {deployConfig.disk} GB</Typography>
                      {deployConfig.hasVolume && (
                        <Typography variant="body2">Volume: {deployConfig.volumeSize} GB</Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="overline" color="text.secondary">Ports</Typography>
                    <Box sx={{ mt: 1 }}>
                      {deployConfig.ports.map((port, index) => (
                        <Typography key={index} variant="body2">{port.exposed} → {port.internal}</Typography>
                      ))}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="overline" color="text.secondary">Variables d'Environnement</Typography>
                    <Box sx={{ mt: 1 }}>
                      {deployConfig.envVars.filter(env => env.key).map((env, index) => (
                        <Typography key={index} variant="body2">{env.key}={env.value}</Typography>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrev}
              disabled={currentStep === 0}
              sx={{ px: 4 }}
            >
              Précédent
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              color={currentStep === steps.length - 1 ? 'success' : 'primary'}
              sx={{ px: 4 }}
            >
              {currentStep === steps.length - 1 ? 'Déployer le Service' : 'Suivant'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default DeployFlow;