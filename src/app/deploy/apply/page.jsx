'use client';
import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Paper,
  Button,
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@/context/ThemeProvider';
import MainLayout from '@/layouts/MainLayout';
import {
  saveServiceConfig,
  applyService,
  uploadNetworkConfig,
  checkNetworkConfigExists,
  checkNetworkIsCompliant,
  applyNetwork,
} from '@/services/deployService';

const decodeConfig = (encodedConfig) => {
  try {
    return JSON.parse(atob(encodedConfig));
  } catch (error) {
    console.error('Error decoding config:', error);
    return null;
  }
};

function ApplyPageContent() {
  const { colors } = useTheme();
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('loading');
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('Initialisation...');
  const [deployConfig, setDeployConfig] = useState(null);
  const [configError, setConfigError] = useState(false);

  const clientId = keycloak?.tokenParsed?.sub;
  const hasDeployed = useRef(false);

  useEffect(() => {
    const configParam = searchParams.get('config');
    if (configParam) {
      const decodedConfig = decodeConfig(configParam);
      if (decodedConfig) {
        setDeployConfig(decodedConfig);
      } else {
        setConfigError(true);
        setErrorMsg('Invalid or corrupted configuration.');
        setStatus('error');
      }
    } else {
      setConfigError(true);
      setErrorMsg('No configuration found. Please return to the configuration page.');
      setStatus('error');
    }
  }, [searchParams]);

  const deploy = useCallback(async () => {
    if (!keycloak?.authenticated || !clientId || hasDeployed.current || !deployConfig) return;
    hasDeployed.current = true;

    const { service, ...configWithoutService } = deployConfig;
    const provider = configWithoutService.provider || 'local';

    try {
      setProgressMsg('Verifying network configuration...');
      let networkConfigExists = false;
      try {
        const check = await checkNetworkConfigExists(clientId, provider);
        networkConfigExists = check.exists;
      } catch (err) {
        console.warn('Error checking network config:', err);
      }

      if (!networkConfigExists) {
        setProgressMsg('Uploading network configuration...');
        await uploadNetworkConfig(clientId, {
          provider,
          network_name: `network-${clientId}`,
        });
      }

      setProgressMsg('Verifying network compliance...');
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

      if (!networkStatus.compliant) {
        console.log('Applying network configuration...');
        await applyNetwork(clientId, provider);

        setProgressMsg('Waiting for network compliance...');
        for (let attempts = 0; attempts < 30; attempts++) {
          await new Promise(r => setTimeout(r, 1000));
          try {
            const s = await checkNetworkIsCompliant(clientId, provider);
            if (s.compliant || s.output?.includes('No changes')) break;
          } catch (err) {
            console.log(`Tentative ${attempts + 1}:`, err.message);
          }
          if (attempts === 29) {
            throw new Error('Network not compliant after 30 attempts.');
          }
        }
      }

      setProgressMsg('Saving service configuration...');
      const { serviceId } = await saveServiceConfig(clientId, service, configWithoutService);

      setProgressMsg('Deployment of the service is in progress. This may take a few minutes.');
      const result = await applyService(clientId, serviceId);

      setResponse(result);
      setStatus('success');
      setProgressMsg('Deployment applied successfully. Your service is being deployed. This may take a few minutes.');
    } catch (err) {
      console.error('Error during deployment:', err);
      setErrorMsg(err.message || 'An error occurred during deployment.');
      setStatus('error');
    }
  }, [keycloak?.authenticated, clientId, deployConfig]);

  useEffect(() => {
    if (keycloak?.authenticated && clientId && deployConfig && !configError) {
      deploy();
    }
  }, [deploy, keycloak?.authenticated, clientId, deployConfig, configError]);

  const handleReturnToConfig = () => {
    router.push('/deploy');
  };

  if (configError) {
    return (
        <MainLayout>
          <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper sx={{ p: 4, bgcolor: colors.paper, borderRadius: 2 }}>
              <Typography variant="h5" color="error" gutterBottom>
                Configuration manquante
              </Typography>
              <Typography color="error" sx={{ mb: 3 }}>
                {errorMsg}
              </Typography>
              <Button
                  variant="contained"
                  onClick={handleReturnToConfig}
                  sx={{ mr: 2 }}
              >
                Retourner à la configuration
              </Button>
            </Paper>
          </Container>
        </MainLayout>
    );
  }

  if (!deployConfig) {
    return (
        <MainLayout>
          <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper sx={{ p: 4, bgcolor: colors.paper, borderRadius: 2 }}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <CircularProgress />
                <Typography variant="body1" color="textSecondary">
                  Loading configuration...
                </Typography>
              </Box>
            </Paper>
          </Container>
        </MainLayout>
    );
  }

  return (
      <MainLayout>
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Paper sx={{ p: 4, bgcolor: colors.paper, borderRadius: 2 }}>
            {status === 'loading' && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <CircularProgress />
                  <Typography variant="body1" color="textSecondary">
                    {progressMsg}
                  </Typography>

                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Service: <strong>{deployConfig.service}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Provider: <strong>{deployConfig.provider || 'local'}</strong>
                    </Typography>
                  </Box>
                </Box>
            )}

            {status === 'success' && (
                <>
                  <Typography variant="h5" color="success.main" gutterBottom>
                    Deployment applied successfully
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Your service is being deployed. This may take a few minutes.
                  </Typography>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Configuration:
                    </Typography>
                    <Typography variant="body2">
                      • Service: {deployConfig.service}
                    </Typography>
                    <Typography variant="body2">
                      • Provider: {deployConfig.provider || 'local'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      Details of the deployment response:
                    </Typography>
                    <pre style={{ fontSize: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleReturnToConfig}
                    >
                      New deployment
                    </Button>
                  </Box>
                </>
            )}

            {status === 'error' && (
                <Box>
                  <Typography variant="h5" color="error" gutterBottom>
                    Deployment failed
                  </Typography>
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errorMsg}
                  </Typography>
                </Box>
            )}
          </Paper>
        </Container>
      </MainLayout>
  );
}

function ApplyPageFallback() {
  const { colors } = useTheme();

  return (
      <MainLayout>
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Paper sx={{ p: 4, bgcolor: colors?.paper, borderRadius: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography variant="body1" color="textSecondary">
                Loading deployment configuration...
              </Typography>
            </Box>
          </Paper>
        </Container>
      </MainLayout>
  );
}

export default function ApplyPage() {
  return (
      <Suspense fallback={<ApplyPageFallback />}>
        <ApplyPageContent />
      </Suspense>
  );
}