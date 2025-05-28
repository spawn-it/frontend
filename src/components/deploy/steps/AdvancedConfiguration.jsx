'use client';
import React, { useMemo } from 'react';
import {
    Box, Typography, TextField, Button, Stack, IconButton, Alert
} from '@mui/material';
import {
    Add as AddIcon, Remove as RemoveIcon, ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from '@/context/ThemeProvider';

const AdvancedConfiguration = ({ deployConfig, updateConfig }) => {
    const { colors } = useTheme();

    const portList = useMemo(() => {
        if (deployConfig.portList && Array.isArray(deployConfig.portList)) {
            return deployConfig.portList;
        }
        return Object.entries(deployConfig.ports || {}).map(([exposed, internal], index) => ({
            id: `port-${index}`,
            exposed,
            internal
        }));
    }, [deployConfig.portList, deployConfig.ports]);

    const envVarList = useMemo(() => {
        if (deployConfig.envVarList && Array.isArray(deployConfig.envVarList)) {
            return deployConfig.envVarList;
        }
        return Object.entries(deployConfig.env_vars || {}).map(([key, value], index) => ({
            id: `env-${index}`,
            key,
            value
        }));
    }, [deployConfig.envVarList, deployConfig.env_vars]);

    const updatePorts = (newList) => {
        updateConfig('portList', newList);
        const newPorts = {};
        newList.forEach(({ exposed, internal }) => {
            if (exposed && internal) {
                newPorts[exposed] = internal;
            }
        });
        updateConfig('ports', newPorts);
    };

    const updateEnvVars = (newList) => {
        updateConfig('envVarList', newList);
        const newVars = {};
        newList.forEach(({ key, value }) => {
            if (key) {
                newVars[key] = value || '';
            }
        });
        updateConfig('env_vars', newVars);
    };

    const addPort = () => {
        const newId = `port-new-${Date.now()}`;
        const newList = [...portList, { id: newId, exposed: '', internal: '' }];
        updatePorts(newList);
    };

    const updatePort = (targetId, field, value) => {
        const newList = portList.map(port =>
            port.id === targetId
                ? { ...port, [field]: value }
                : port
        );
        updatePorts(newList);
    };

    const removePort = (targetId) => {
        const newList = portList.filter(port => port.id !== targetId);
        updatePorts(newList);
    };

    const addEnvVar = () => {
        const newId = `env-new-${Date.now()}`;
        const newList = [...envVarList, { id: newId, key: '', value: '' }];
        updateEnvVars(newList);
    };

    const updateEnvVar = (targetId, field, value) => {
        const newList = envVarList.map(envVar =>
            envVar.id === targetId
                ? { ...envVar, [field]: value }
                : envVar
        );
        updateEnvVars(newList);
    };

    const removeEnvVar = (targetId) => {
        const newList = envVarList.filter(envVar => envVar.id !== targetId);
        updateEnvVars(newList);
    };

    return (
        <Box sx={{ mt: 2, mb: 4 }}>
            <Alert severity="info" sx={{ mb: 4, bgcolor: colors.paper, color: colors.text }}>
                La configuration par défaut est prête à l'emploi. Modifiez les ports ou les variables <strong>uniquement si vous savez ce que vous faites</strong>.
            </Alert>

            {/* Port Mapping */}
            <Box mb={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ color: colors.textSecondary }}>
                        Mappage des Ports
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                        onClick={addPort}
                        sx={{
                            borderColor: colors.border, color: colors.text,
                            '&:hover': { borderColor: colors.inputBorderHover, bgcolor: colors.inputBg }
                        }}
                    >
                        Ajouter un Port
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {portList.map((port) => (
                        <Box key={port.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                type="number"
                                value={port.exposed}
                                onChange={(e) => updatePort(port.id, 'exposed', e.target.value)}
                                placeholder="Port exposé"
                                size="small"
                                sx={inputStyle(colors)}
                            />
                            <ArrowForwardIcon sx={{ color: colors.textMuted }} />
                            <TextField
                                type="number"
                                value={port.internal}
                                onChange={(e) => updatePort(port.id, 'internal', e.target.value)}
                                placeholder="Port conteneur"
                                size="small"
                                sx={inputStyle(colors)}
                            />
                            {portList.length > 1 && (
                                <IconButton color="error" onClick={() => removePort(port.id)} size="small">
                                    <RemoveIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Environment Variables */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ color: colors.textSecondary }}>
                        Variables d'Environnement
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                        onClick={addEnvVar}
                        sx={{
                            borderColor: colors.border, color: colors.text,
                            '&:hover': { borderColor: colors.inputBorderHover, bgcolor: colors.inputBg }
                        }}
                    >
                        Ajouter une Variable
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {envVarList.map((envVar) => (
                        <Box key={envVar.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={envVar.key}
                                onChange={(e) => updateEnvVar(envVar.id, 'key', e.target.value)}
                                placeholder="Nom"
                                size="small"
                                sx={inputStyle(colors)}
                            />
                            <Typography>=</Typography>
                            <TextField
                                value={envVar.value}
                                onChange={(e) => updateEnvVar(envVar.id, 'value', e.target.value)}
                                placeholder="Valeur"
                                size="small"
                                sx={inputStyle(colors)}
                            />
                            {envVarList.length > 1 && (
                                <IconButton color="error" onClick={() => removeEnvVar(envVar.id)} size="small">
                                    <RemoveIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

const inputStyle = (colors) => ({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        bgcolor: colors.inputBg,
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.inputBorderHover },
        '& input': { color: colors.text },
    }
});

export default AdvancedConfiguration;