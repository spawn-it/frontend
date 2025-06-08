'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@/context/ThemeProvider';
import MainLayout from '@/layouts/MainLayout';
import {
  saveServiceConfig,
  applyService,
  uploadNetworkConfig,
  checkNetworkConfigExists,
  checkNetworkIsCompliant,
  applyNetwork
} from '@/services/deployService';

function ApplyPageContent() {
  const { colors } = useTheme();
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('Initialisation...');
  const clientId = keycloak?.tokenParsed?.sub;
  const hasDeployed = useRef(false);

  const deploy = useCallback(async () => {
    if (!keycloak?.authenticated || !clientId || hasDeployed.current) return;

    hasDeployed.current = true;

    const rawConfig = localStorage.getItem('deployConfig');
    if (!rawConfig) {
      setErrorMsg('Configuration manquante.');
      setStatus('error');
      return;
    }

    console.log('Raw config from localStorage:', rawConfig);
    const parsedConfig = JSON.parse(rawConfig);
    const { service, ...configWithoutService } = parsedConfig;

    let provider = configWithoutService.provider || 'local';
    if (!provider) {
      console.warn('Provider manquant, fallback sur "local"');
      provider = 'local';
    }

    try {
      // 1. Vérifie si la config réseau existe
      setProgressMsg('Vérification de la configuration réseau...');
      let networkConfigExists = false;

      try {
        const networkCheck = await checkNetworkConfigExists(clientId, provider);
        networkConfigExists = networkCheck.exists;
      } catch (err) {
        console.log('Erreur vérification config réseau:', err);
      }

      // 2. Créer la config réseau si manquante
      if (!networkConfigExists) {
        setProgressMsg('Création de la configuration réseau...');
        const networkConfig = {
          provider,
          network_name: `network-${clientId}`
        };
        await uploadNetworkConfig(clientId, networkConfig);
      }

      // 3. Vérifie compliance réseau
      setProgressMsg('Vérification de l\'état du réseau...');
      let networkStatus;
      try {
        networkStatus = await checkNetworkIsCompliant(clientId, provider);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('NoSuchKey')) {
          networkStatus = { compliant: false };
        } else {
          throw err;
        }
      }

      // 4. Applique le réseau si non compliant
      if (!networkStatus.compliant) {
        setProgressMsg('Application de l\'infrastructure réseau...');
        await applyNetwork(clientId, provider);

        // 5. Attendre qu’il devienne compliant
        setProgressMsg('Attente de la finalisation du réseau...');
        let attempts = 0;
        const maxAttempts = 30;

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const currentStatus = await checkNetworkIsCompliant(clientId, provider);
            if (
              currentStatus.compliant ||
              (currentStatus.output && currentStatus.output.includes('No changes'))
            ) break;
          } catch (err) {
            console.log(`Tentative ${attempts + 1}:`, err.message);
          }
          attempts++;
        }

        if (attempts >= maxAttempts) {
          throw new Error('Timeout: le réseau n\'est pas devenu compliant à temps');
        }
      }

      // 6. Sauvegarder la config service
      setProgressMsg('Sauvegarde de la configuration du service...');
      const data = await saveServiceConfig(clientId, service, configWithoutService);
      const serviceId = data.serviceId;

      // 7. Appliquer le service
      setProgressMsg('Déploiement du service...');
      const result = await applyService(clientId, serviceId);

      setResponse(result);
      setStatus('success');
      setProgressMsg('Déploiement terminé avec succès !');
    } catch (err) {
      console.error('Erreur durant le déploiement:', err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  }, [keycloak?.authenticated, clientId]);

  useEffect(() => {
    deploy();
  }, [deploy]);

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
