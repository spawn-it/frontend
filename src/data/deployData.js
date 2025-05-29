// data/deployData.js

export const infrastructureProviders = [
    {
        id: 'local',
        name: 'Docker (Local)',
        description: 'Déployer sur des conteneurs Docker',
        icon: '🐳',
        color: 'primary',
    },
    {
        id: 'aws',
        name: 'AWS (EC2)',
        description: 'Déployer sur Amazon Web Services',
        icon: '☁️',
        color: 'warning',
        borderColor: 'border-orange-200',
    },
    {
        id: 'gcp',
        name: 'Google Cloud',
        description: 'Déployer sur Google Cloud Platform',
        icon: '🌩️',
        color: 'success',
        borderColor: 'border-green-200',
    }
];

export const availableServices = [
    {
        id: 'minecraft',
        name: 'Serveur Minecraft',
        description: 'Déployer des serveurs Minecraft évolutifs',
        icon: '🎮',
        color: 'success',
        image: '/api/placeholder/800/400'
    },
    {
        id: 'quake',
        name: 'QuakeJS',
        description: 'Serveurs Quake classiques basés sur le web',
        icon: '🕹️',
        color: 'warning',
        image: '/api/placeholder/800/400'
    },
    {
        id: 'wordpress',
        name: 'WordPress',
        description: 'Hébergement WordPress optimisé',
        icon: '📝',
        color: 'info',
        image: '/api/placeholder/800/400'
    }
];

export const steps = [
    { number: 1, title: 'Choisir le Service', desc: 'Sélectionner le type de service' },
    { number: 2, title: 'Choisir le Provider', desc: 'Sélectionner l\'infrastructure' },
    { number: 3, title: 'Configuration', desc: 'Variables d\'environnement' },
    { number: 4, title: 'Vérification', desc: 'Confirmer le déploiement' }
];

export const deployConfig = {
    provider: '',
    serviceType: '',
    ports: [{ exposed: '80', internal: '80' }],
    envVars: [{ key: '', value: '' }]
};