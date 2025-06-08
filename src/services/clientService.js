const baseUrl = 'http://localhost:8000/api/clients';

export function getClientServices(clientId) {
  return fetch(`${baseUrl}/${encodeURIComponent(clientId)}/services`)
    .then((response) => {
      if (!response.ok) throw new Error(`Impossible de récupérer les services du client ${clientId}`);
      return response.json();
    });
}
