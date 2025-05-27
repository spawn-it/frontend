// data/deployData.js

export const infrastructureProviders = [
    {
        id: 'docker',
        name: 'Docker',
        description: 'Déployer sur des conteneurs Docker',
        icon: '🐳',
        color: 'primary',
        image: '/api/placeholder/800/400'
    },
    {
        id: 'aws',
        name: 'AWS (EC2)',
        description: 'Déployer sur Amazon Web Services',
        icon: '☁️',
        color: 'warning',
        borderColor: 'border-orange-200',
        image: '/api/placeholder/800/400'
    },
    {
        id: 'gcp',
        name: 'Google Cloud',
        description: 'Déployer sur Google Cloud Platform',
        icon: '🌩️',
        color: 'success',
        borderColor: 'border-green-200',
        image: '/api/placeholder/800/400'
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

export const availableCpuOptions = [
    { value: '0.5', label: '0.5 vCPU', price: 'Charges légères' },
    { value: '1', label: '1 vCPU', price: 'Charges standard' },
    { value: '2', label: '2 vCPU', price: 'Charges moyennes' },
    { value: '4', label: '4 vCPU', price: 'Charges lourdes' },
    { value: '8', label: '8 vCPU', price: 'Charges entreprise' }
];

export const availableRamOptions = [
    { value: '512', label: '512 MB', description: 'Applications minimales' },
    { value: '1024', label: '1 GB', description: 'Petites applications' },
    { value: '2048', label: '2 GB', description: 'Applications standard' },
    { value: '4096', label: '4 GB', description: 'Applications moyennes' },
    { value: '8192', label: '8 GB', description: 'Grandes applications' },
    { value: '16384', label: '16 GB', description: 'Applications entreprise' }
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