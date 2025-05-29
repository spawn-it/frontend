const apiUrl = `http://localhost:8000/api`;

export function saveServiceConfig(clientId, serviceId, config) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/${encodeURIComponent(serviceId)}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  }).then(res => {
    if (!res.ok) throw new Error(`Erreur sauvegarde config: ${res.status}`);
    return res.json();
  });
}

// CORRIGÉ - Ajout de "/clients/" manquant
export function applyService(clientId, serviceId) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/${encodeURIComponent(serviceId)}/apply`, {
    method: 'POST',
  }).then(res => {
    if (!res.ok) throw new Error(`Erreur application config: ${res.status}`);
    return res.json();
  });
}

export function checkNetworkConfigExists(clientId, provider) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/network/config?provider=${encodeURIComponent(provider)}`).then(res => {
    if (res.status === 404) return { exists: false };
    if (!res.ok) throw new Error(`Erreur vérification config réseau: ${res.status}`);
    return res.json();
  });
}

export function uploadNetworkConfig(clientId, config) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/network/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  }).then(res => {
    if (!res.ok) throw new Error(`Erreur création config réseau: ${res.status}`);
    return res.json();
  });
}

export function checkNetworkIsCompliant(clientId, provider) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/network/status?provider=${encodeURIComponent(provider)}`).then(res => {
    if (!res.ok) throw new Error(`Erreur vérification statut réseau: ${res.status}`);
    return res.json();
  });
}

export function applyNetwork(clientId, provider) {
  return fetch(`${apiUrl}/clients/${encodeURIComponent(clientId)}/network/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider })
  }).then(res => {
    if (!res.ok) throw new Error(`Erreur application réseau: ${res.status}`);
    return res.json();
  });
}