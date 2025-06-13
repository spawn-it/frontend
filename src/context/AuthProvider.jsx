'use client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

let keycloakInstance = null;

const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'spawn-it-realm',
      clientId: 'myclient',
    });
  }
  return keycloakInstance;
};

const eventConfig = {
  onAuthLogout: () => {
    window.location.href = '/';
  },
};

export function AuthProvider({ children }) {
  const keycloak = getKeycloakInstance();

  const initOptions = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      eventConfig={eventConfig}
    >
      {children}
    </ReactKeycloakProvider>
  );
}
