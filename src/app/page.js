'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, 
  Avatar,
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Divider,
  Grid, 
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SecurityIcon from '@mui/icons-material/Security';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha } from '@mui/material/styles';

// Catégories de services disponibles en style Netflix
const categories = [
  {
    id: 'games',
    name: 'Game Servers',
    items: [
      { id: 'minecraft', name: 'Minecraft', image: 'https://www.rollingstone.com/wp-content/uploads/2025/04/je-minecraft001.jpg' },
      { id: 'quake', name: 'QuakeJS', image: 'https://images.ctfassets.net/rporu91m20dc/5grpX7QHxBCgyWyrloau5/437dc1db65b143148b9df456bc18628d/QUAKE_logo_HERO_1920x870.jpg' },
      { id: 'rust', name: 'Rust', image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2021/05/Rust-Console-Edition-Review.jpg' },
      { id: 'csgo', name: 'CS:GO', image: 'https://preview.redd.it/v065cssvidh01.jpg?width=1080&crop=smart&auto=webp&s=feb6e968c2257546013f8827513688e0144930f6' }
    ]
  },
  {
    id: 'servers',
    name: 'Server Types',
    items: [
      { id: 'hosting', name: 'Simple Hosting', image: 'https://www.shutterstock.com/image-photo/data-centers-filled-rows-servers-600nw-2502153963.jpg' },
      { id: 'loadbalancer', name: 'Load Balancer', image: 'https://media.istockphoto.com/id/1132382596/photo/aerial-top-view-highway-road-intersection-roundabout-or-circle-at-night-for-transportation.jpg?s=612x612&w=0&k=20&c=fbCg3NLpqG61gNYinUCLTnYaWUaSy1uJTCU-a7XtntM=' },
      { id: 'k8s', name: 'Kubernetes Node', image: 'https://miro.medium.com/v2/resize:fit:1200/0*dEKpDVaBEslRnpeM.jpeg' },
      { id: 'postgresql', name: 'PostgreSQL', image: 'https://netlibsecurity.com/wp-content/uploads/2024/10/PostgreSQL_NetLib_Encryptionizer.png' },
    ]
  },
  {
    id: 'apps',
    name: 'Applications',
    items: [
      { id: 'wordpress', name: 'WordPress', image: 'https://elementor.com/cdn-cgi/image/f=auto,w=1200,h=628/https://elementor.com/blog/wp-content/uploads/2023/05/How-to-create-a-WordPress-website.png' },
      { id: 'ghost', name: 'Ghost', image: 'https://francaisalondres.com/content/images/2024/07/ghost-cms-Logo.png' },
      { id: 'drupal', name: 'Drupal', image: 'https://wangler.io/content/images/size/w960/2022/05/keycloak.jpeg' },
      { id: 'keycloak', name: 'Keycloak', image: 'https://cdn.stackoverflow.co/images/jo7n4k8s/production/989197bbd274de342caf84c3642d8c6bc7b980ea-1920x700.png?rect=294,0,1333,700&w=1200&h=630&auto=format&dpr=2' }
    ]
  },
  {
    id: 'devtools',
    name: 'Dev Tools',
    items: [
      { id: 'gitlab', name: 'GitLab CE', image: 'https://btech.id/media/images/Page/2024/02/28/GitLab-logo-2709954696.png' },
      { id: 'jenkins', name: 'Jenkins', image: 'https://logz.io/wp-content/uploads/2018/10/jenkins_in_a_nutshell_-_main.jpg' },
      { id: 'sonarqube', name: 'SonarQube', image: 'https://buddy.works/guides/covers/sonarqube/sonarqube-share.png' },
      { id: 'artifactory', name: 'Artifactory', image: 'https://blog.johnsonpremier.net/assets/img/posts/2024/artifactory_overview/artifactory_overview.png' }
    ]
  }
];

// Service types disponibles pour les autres sections
const services = [
  {
    id: 'minecraft',
    name: 'Minecraft Server',
    description: 'Deploy scalable Minecraft servers with automatic backups',
    icon: '🎮',
    color: '#4caf50',
    bgColor: '#e8f5e9',
    borderColor: '#c8e6c9',
    features: ['1-Click Deploy', 'Auto Backups', 'DDoS Protection'],
    image: '/api/placeholder/400/250',
    gradient: ['#66bb6a', '#43a047']
  },
  {
    id: 'quake',
    name: 'QuakeJS Server',
    description: 'Classic web-based Quake servers with low latency',
    icon: '🕹️',
    color: '#ff9800',
    bgColor: '#fff3e0',
    borderColor: '#ffe0b2',
    features: ['Browser-Based', 'Custom Maps', 'Analytics'],
    image: '/api/placeholder/400/250',
    gradient: ['#ffa726', '#fb8c00']
  },
  {
    id: 'wordpress',
    name: 'WordPress Hosting',
    description: 'Optimized WordPress hosting with free SSL',
    icon: '📝',
    color: '#2196f3',
    bgColor: '#e3f2fd',
    borderColor: '#bbdefb',
    features: ['Free SSL', 'Auto Updates', 'Cache Optimization'],
    image: '/api/placeholder/400/250',
    gradient: ['#42a5f5', '#1e88e5']
  },
  {
    id: 'generic',
    name: 'Custom Server',
    description: 'Deploy any application with our flexible infrastructure',
    icon: '⚙️',
    color: '#9c27b0',
    bgColor: '#f3e5f5',
    borderColor: '#e1bee7',
    features: ['Root Access', 'Custom Images', 'API Access'],
    image: '/api/placeholder/400/250',
    gradient: ['#ab47bc', '#8e24aa']
  }
];

// Testimonials
const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Minecraft Server Owner',
    content: 'Running my Minecraft server has never been easier. The deployment was instant and the performance is incredible!',
    avatar: '/api/placeholder/48/48'
  },
  {
    name: 'Sarah Johnson',
    role: 'Web Developer',
    content: 'The WordPress hosting is fantastic. My sites load super fast and I love the automatic updates feature.',
    avatar: '/api/placeholder/48/48'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Game Community Leader',
    content: 'Managing multiple game servers is a breeze with this platform. The dashboard makes everything so simple.',
    avatar: '/api/placeholder/48/48'
  }
];

// Composant pour les services en style Netflix
const NetflixStyleServices = () => {
  const theme = useTheme();
  
  // Utiliser des refs individuelles pour chaque catégorie
  const [categoryRefs, setCategoryRefs] = useState({});
  
  // Initialiser les refs au chargement du composant
  useEffect(() => {
    // Créer un objet de refs pour chaque catégorie
    const refs = categories.reduce((acc, category) => {
      acc[category.id] = React.createRef();
      return acc;
    }, {});
    
    setCategoryRefs(refs);
  }, []);
  
  // Fonction pour faire défiler les conteneurs
  const scrollContainer = (categoryId, direction) => {
    const container = categoryRefs[categoryId]?.current;
    if (container) {
      const scrollAmount = direction === 'left' 
        ? -container.offsetWidth * 0.8
        : container.offsetWidth * 0.8;
      
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }} id="services">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', width: '100%', mb: 8 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Choose Your Service
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Deploy any service with our pre-configured templates
          </Typography>
        </Box>
        
        {/* Render each category */}
        {categories.map((category) => (
          <Box key={category.id} sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                {category.name}
              </Typography>
              
              <Stack direction="row" spacing={1}>
                <IconButton 
                  size="small" 
                  onClick={() => scrollContainer(category.id, 'left')}
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => scrollContainer(category.id, 'right')}
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Stack>
            </Box>
            
            {/* Row of items for this category */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                pb: 2
              }}
            >
              {category.items.map((item) => (
                <Card 
                  key={item.id} 
                  sx={{ 
                    width: 280, 
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: theme.shadows[10],
                      zIndex: 1,
                      '& .MuiCardContent-root': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    }
                  }}
                >
                  {/* Service Image */}
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image}
                    alt={item.name}
                  />
                  
                  {/* Overlay with name on hover */}
                  <CardContent 
                    className="MuiCardContent-root"
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                      color: 'white',
                      p: 2,
                      pt: 3,
                      opacity: 0.7,
                      transform: 'translateY(5px)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Container>
    </Box>
  );
};

function LandingPage() {
  const [activeTab, setActiveTab] = useState('features');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Pour compenser l'AppBar fixe
  const appBarHeight = 64; // hauteur approximative de l'AppBar
  
  // Refs pour les conteneurs défilables
  const featuresContainerRef = useRef(null);
  const testimonialsContainerRef = useRef(null);
  
  // Fonctions pour faire défiler les conteneurs
  const scrollContainer = (containerRef, direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount = direction === 'left' 
        ? -container.offsetWidth * 0.8
        : container.offsetWidth * 0.8;
      
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const scrollFeatures = (direction) => scrollContainer(featuresContainerRef, direction);
  const scrollTestimonials = (direction) => scrollContainer(testimonialsContainerRef, direction);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#121212'
    }}>
      {/* Navigation */}
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: alpha('#0f2027', 0.85), backdropFilter: 'blur(8px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 1,
                background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)'
              }} />
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'white' }}>
                SpawnIt
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              <Button href="#services" color="inherit" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                Services
              </Button>
              <Button href="#features" color="inherit" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                Features
              </Button>
              <Button href="#testimonials" color="inherit" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                Testimonials
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                disableElevation
                sx={{
                  backgroundColor: 'white',
                  color: '#0f2027',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
  sx={{
    position: 'relative',
    overflow: 'hidden',
    py: { xs: 6, md: 15 },
    backgroundImage: `
      linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%),
      url("https://img.freepik.com/free-photo/panoramic-view-pink-light-circle-clouds-ai-generated_268835-8282.jpg?t=st=1747667472~exp=1747671072~hmac=edb6f4dae0b51d51919562938b800fd9be206900930d0929437ddcc1d55972e9&w=1380")
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: 'white'
  }}
>


        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" component="h1" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  Spawn Your Services
                  <Typography component="span" variant="h2" color="primary.light" display="block" sx={{ 
                    mt: 1,
                    fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 'bold'
                  }}>
                    In Seconds
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* NetFlix Style Services Section */}
      <Box sx={{ pt: 4, pb: 4, bgcolor: '#121212', color: 'white' }} id="services">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', width: '100%', mb: 4 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
              Choose Your Service
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Deploy any service with our pre-configured templates
            </Typography>
          </Box>
          
          {/* Render each category */}
          {categories.map((category) => (
            <Box key={category.id} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {category.name}
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    size="small" 
                    onClick={() => scrollContainer(category.id, 'left')}
                    sx={{ 
                      border: 1, 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => scrollContainer(category.id, 'right')}
                    sx={{ 
                      border: 1, 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Stack>
              </Box>
              
              {/* Row of items for this category */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  overflowX: 'hidden',
                  scrollBehavior: 'smooth',
                  pb: 2
                }}
              >
                {category.items.map((item) => (
                  <Card 
                    key={item.id} 
                    sx={{ 
                      width: 280, 
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s',
                      bgcolor: 'transparent',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.5)',
                        zIndex: 1,
                        '& .MuiCardContent-root': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                  >
                    {/* Service Image */}
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.image}
                      alt={item.name}
                      sx={{ 
                        borderRadius: 2,
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          filter: 'brightness(1.2)'
                        }
                      }}
                    />
                    
                    {/* Overlay with name on hover */}
                    <CardContent 
                      className="MuiCardContent-root"
                      sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        color: 'white',
                        p: 2,
                        pt: 3,
                        opacity: 0.7,
                        transform: 'translateY(5px)',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '0 0 8px 8px'
                      }}
                    >
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                        {item.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#1E1E1E' }} id="features">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                Platform Features
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Everything you need to run your services at scale
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                position: 'absolute', 
                top: -60, 
                right: 0,
                zIndex: 2
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => scrollFeatures('left')}
                sx={{ 
                  border: 1, 
                  borderColor: 'rgba(255, 255, 255,.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => scrollFeatures('right')}
                sx={{ 
                  border: 1, 
                  borderColor: 'rgba(255, 255, 255, .2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
            
            <Box 
              ref={featuresContainerRef}
              sx={{ 
                display: 'flex', 
                gap: 4, 
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                pb: 3
              }}
            >
              <Paper sx={{ p: 3, borderRadius: 2, width: 320, flexShrink: 0, bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  <FlashOnIcon />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                  1-Click Deploy
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Deploy any service with just one click. No complex setup required.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, borderRadius: 2, width: 320, flexShrink: 0, bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    color: theme.palette.success.main,
                    mb: 2
                  }}
                >
                  <SecurityIcon />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                  Enterprise Security
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Military-grade security with DDoS protection and SSL certificates.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, borderRadius: 2, width: 320, flexShrink: 0, bgcolor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
                <Box 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.secondary.main, 0.2),
                    color: theme.palette.secondary.main,
                    mb: 2
                  }}
                >
                  <AutorenewIcon />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                  Auto-Scaling
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Automatically scale your resources based on demand.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box> 

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: '#121212' }} id="testimonials">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                What Our Customers Say
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Join thousands of satisfied users
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                position: 'absolute', 
                top: -60, 
                right: 0,
                zIndex: 2
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => scrollTestimonials('left')}
                sx={{ 
                  border: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => scrollTestimonials('right')}
                sx={{ 
                  border: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
            
            <Box 
              ref={testimonialsContainerRef}
              sx={{ 
                display: 'flex', 
                gap: 4, 
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                pb: 3
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Paper 
                  key={index} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    width: 384, 
                    flexShrink: 0, 
                    bgcolor: 'rgba(255,255,255,0.07)', 
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.4)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0A0A0A', borderTop: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'center' }, mb: { xs: 3, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 3, sm: 0 } }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: 1,
                background: 'linear-gradient(135deg, #2196f3 0%, #9c27b0 100%)'
              }} />
              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', color: 'white' }}>
                CloudDeploy
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Privacy</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Terms</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Contact</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
            &copy; 2025 CloudDeploy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;