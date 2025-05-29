'use client';
import React from 'react';
import { Box, Container, Paper, Typography, Chip } from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import { useParams } from 'next/navigation';
import MainLayout from '../../../layouts/MainLayout';
import { useTheme } from '@/context/ThemeProvider';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { colors } = useTheme();
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const hasAccess = () => {
    if (!keycloak.tokenParsed) return false;
    
    const tokenUserId = keycloak.tokenParsed.sub || keycloak.tokenParsed.preferred_username;
    if (tokenUserId === userId) return true;
    
    return false;
  };

  if (!hasAccess()) {
    router.push('/');
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: colors.background,
      color: colors.text,
      transition: 'all 0.3s'
    }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.paper,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Tableau de bord personnel
          </Typography>
          
          <Chip 
            label={`ID: ${userId}`} 
            variant="outlined" 
            sx={{ mb: 3 }}
          />
          
          <Typography variant="h6" sx={{ color: colors.success || '#4caf50', mb: 2 }}>
            Vous êtes logué !
          </Typography>
          
          {keycloak.tokenParsed && (
            <Box sx={{ mt: 3, p: 2, bgcolor: colors.background, borderRadius: 1 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Utilisateur :</strong> {keycloak.tokenParsed.preferred_username || keycloak.tokenParsed.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <strong>Email :</strong> {keycloak.tokenParsed.email}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                <strong>Dashboard ID :</strong> {userId}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

function Dashboard() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}

export default Dashboard;