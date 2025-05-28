const apiUrl = `http://localhost:8000/api/catalog`;

export function getCatalog() {
    return fetch(`${apiUrl}`)
        .then((response) => {
            if (!response.ok) throw new Error('Erreur lors de la récupération du catalogue');
            return response.json();
        });
}

export function getServiceByName(name) {
    return fetch(`${apiUrl}/${encodeURIComponent(name)}`)
        .then((response) => {
            if (!response.ok) throw new Error(`Service "${name}" introuvable`);
            return response.json();
        });
}

// Récupère uniquement le chemin du fichier template
export function getTemplateFile(name) {
    return fetch(`${apiUrl}/${encodeURIComponent(name)}/template`)
        .then((response) => {
            if (!response.ok) throw new Error(`Template introuvable pour "${name}"`);
            return response.json();
        });
}

// Récupère uniquement le chemin de l’image
export function getImagePath(name) {
    return fetch(`${apiUrl}/${encodeURIComponent(name)}/image`)
        .then((response) => {
            if (!response.ok) throw new Error(`Image introuvable pour "${name}"`);
            return response.json();
        });
}
