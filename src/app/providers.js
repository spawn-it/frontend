'use client'

import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'spawn-it-realm',
  clientId: 'myclient',
});

export function AuthProvider({ children }) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'login-required',
        pkceMethod: 'S256',
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
}
