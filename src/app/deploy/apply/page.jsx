'use client';
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@/context/ThemeProvider';
import MainLayout from '@/layouts/MainLayout';
import { saveServiceConfig, applyService, uploadNetworkConfig, checkNetworkConfigExists, checkNetworkIsCompliant, applyNetwork } from '@/services/deployService';

function ApplyPageContent() {
  const { colors } = useTheme();
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('Initialisation...');
  const clientId = keycloak?.tokenParsed?.sub;

  useEffect(() => {
    const deploy = async () => {
      if (!keycloak?.authenticated) {
        setErrorMsg('Vous devez être connecté.');
        setStatus('error');
        return;
      }

      const rawConfig = localStorage.getItem('deployConfig');
      if (!rawConfig) {
        setErrorMsg('Configuration manquante.');
        setStatus('error');
        return;
      }

      console.log('Raw config from localStorage:', rawConfig);

      const parsedConfig = JSON.parse(rawConfig);
      console.log('Parsed config:', parsedConfig);

      const { service, ...configWithoutService } = parsedConfig;
      
      // Déterminer le provider avec une valeur par défaut
      let provider = configWithoutService.provider;
      
      // Si pas de provider dans la config, utiliser 'local' par défaut
      if (!provider || provider === '' || provider === null || provider === undefined) {
        console.warn('Provider manquant dans la configuration, utilisation de "local" par défaut');
        provider = 'local';
      }

      console.log('Provider utilisé:', provider);
      console.log('Service:', service);
      console.log('Config without service:', configWithoutService);

      try {
        // 1. Vérifier et créer la config réseau si nécessaire
        setProgressMsg('Vérification de la configuration réseau...');
        let networkConfigExists = false;
        try {
          console.log('Vérification existence config réseau...');
          const networkCheck = await checkNetworkConfigExists(clientId, provider);
          networkConfigExists = networkCheck.exists;
          console.log('Config réseau existe:', networkConfigExists);
        } catch (err) {
          console.log('Erreur lors de la vérification de la config réseau:', err);
          networkConfigExists = false;
        }

        // Si la config n'existe pas, la créer
        if (!networkConfigExists) {
          setProgressMsg('Création de la configuration réseau...');
          console.log('Configuration réseau manquante, création...');
          console.log('Provider:', provider);
          console.log('ClientId:', clientId);
          
          const networkConfig = {
            provider: provider,
            network_name: `network-${clientId}`
          };
          
          console.log('Config réseau à créer:', networkConfig);
          
          try {
            await uploadNetworkConfig(clientId, networkConfig);
            console.log('Config réseau créée avec succès');
          } catch (err) {
            console.error('Erreur création config réseau:', err);
            throw err;
          }
        }

        // 2. Vérifier la compliance du réseau
        setProgressMsg('Vérification de l\'état du réseau...');
        let networkStatus;
        try {
          console.log('Vérification compliance réseau...');
          networkStatus = await checkNetworkIsCompliant(clientId, provider);
          console.log('Status réseau:', networkStatus);
        } catch (err) {
          console.log('Erreur vérification compliance:', err);
          // Si l'erreur est "NoSuchKey", le réseau n'est pas compliant
          if (err.message.includes('404') || err.message.includes('NoSuchKey')) {
            networkStatus = { compliant: false };
          } else {
            throw err;
          }
        }

        // 3. Appliquer le réseau et ATTENDRE qu'il soit terminé
        if (!networkStatus.compliant) {
          setProgressMsg('Application de l\'infrastructure réseau...');
          console.log('Réseau non compliant, application...');
          await applyNetwork(clientId, provider);
          
          // ATTENDRE que le réseau soit compliant avant de continuer
          setProgressMsg('Attente de la finalisation du réseau...');
          console.log('Attente de la compliance du réseau...');
          let attempts = 0;
          const maxAttempts = 30; // 30 secondes max
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
            
            try {
              const currentStatus = await checkNetworkIsCompliant(clientId, provider);
              console.log(`Tentative ${attempts + 1}: Réseau compliant = ${currentStatus.compliant}`);
              setProgressMsg(`Vérification du réseau... (${attempts + 1}/${maxAttempts})`);
              
              // CORRECTION: Vérifier aussi si l'output contient "No changes"
              if (currentStatus.compliant || 
                  (currentStatus.output && currentStatus.output.includes('No changes'))) {
                console.log('Réseau maintenant compliant !');
                break;
              }
            } catch (err) {
              console.log(`Erreur vérification tentative ${attempts + 1}:`, err.message);
            }
            
            attempts++;
          }
          
          if (attempts >= maxAttempts) {
            throw new Error('Timeout: Le réseau n\'est pas devenu compliant dans les temps');
          }
        }

        // 4. Maintenant déployer le service
        setProgressMsg('Sauvegarde de la configuration du service...');
        console.log('Sauvegarde config service...');
        await saveServiceConfig(clientId, service, configWithoutService);
        
        setProgressMsg('Déploiement du service...');
        console.log('Application du service...');
        const result = await applyService(clientId, service);
        
        setResponse(result);
        setStatus('success');
        setProgressMsg('Déploiement terminé avec succès !');
      } catch (err) {
        console.error('Erreur durant le déploiement:', err);
        setErrorMsg(err.message);
        setStatus('error');
      }
    };

    deploy();
  }, [keycloak?.authenticated, clientId]);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, bgcolor: colors.paper, borderRadius: 2 }}>
        {status === 'loading' && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress />
            <Typography variant="body1" color="textSecondary">
              {progressMsg}
            </Typography>
          </Box>
        )}
        {status === 'success' && (
          <>
            <Typography variant="h5" color="success.main" gutterBottom>
              Déploiement appliqué avec succès
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Votre service a été déployé et est maintenant disponible.
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Box>
          </>
        )}
        {status === 'error' && (
          <Box>
            <Typography variant="h5" color="error" gutterBottom>
              Erreur de déploiement
            </Typography>
            <Typography color="error">{errorMsg}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default function ApplyPage() {
  return (
    <MainLayout>
      <ApplyPageContent />
    </MainLayout>
  );
}