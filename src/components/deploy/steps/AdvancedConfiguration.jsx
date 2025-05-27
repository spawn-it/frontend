'use client';
import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from '@/context/ThemeProvider';

const AdvancedConfiguration = ({ deployConfig, updateConfig }) => {
    const { colors } = useTheme();

    const addPort = () => {
        updateConfig('ports', [...deployConfig.ports, { exposed: '', internal: '' }]);
    };

    const updatePort = (index, field, value) => {
        const newPorts = [...deployConfig.ports];
        newPorts[index][field] = value;
        updateConfig('ports', newPorts);
    };

    const removePort = (index) => {
        if (deployConfig.ports.length > 1) {
            const newPorts = deployConfig.ports.filter((_, i) => i !== index);
            updateConfig('ports', newPorts);
        }
    };

    const addEnvVar = () => {
        updateConfig('envVars', [...deployConfig.envVars, { key: '', value: '' }]);
    };

    const updateEnvVar = (index, field, value) => {
        const newEnvVars = [...deployConfig.envVars];
        newEnvVars[index][field] = value;
        updateConfig('envVars', newEnvVars);
    };

    const removeEnvVar = (index) => {
        if (deployConfig.envVars.length > 1) {
            const newEnvVars = deployConfig.envVars.filter((_, i) => i !== index);
            updateConfig('envVars', newEnvVars);
        }
    };

    return (
        <Box sx={{ mt: 2, mb: 4 }}>
            {/* Port Configuration */}
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
                            borderColor: colors.border,
                            color: colors.text,
                            '&:hover': {
                                borderColor: colors.inputBorderHover,
                                bgcolor: colors.inputBg
                            }
                        }}
                    >
                        Ajouter un Port
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {deployConfig.ports.map((port, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={port.exposed}
                                onChange={(e) => updatePort(index, 'exposed', e.target.value)}
                                placeholder="Port exposé"
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: colors.inputBg,
                                        '& fieldset': {
                                            borderColor: colors.inputBorder,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.inputBorderHover,
                                        },
                                        '& input': {
                                            color: colors.text,
                                        }
                                    }
                                }}
                            />
                            <ArrowForwardIcon sx={{ color: colors.textMuted }} />
                            <TextField
                                value={port.internal}
                                onChange={(e) => updatePort(index, 'internal', e.target.value)}
                                placeholder="Port conteneur"
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: colors.inputBg,
                                        '& fieldset': {
                                            borderColor: colors.inputBorder,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.inputBorderHover,
                                        },
                                        '& input': {
                                            color: colors.text,
                                        }
                                    }
                                }}
                            />
                            {deployConfig.ports.length > 1 && (
                                <IconButton
                                    color="error"
                                    onClick={() => removePort(index)}
                                    size="small"
                                    sx={{ color: '#f44336' }}
                                >
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
                            borderColor: colors.border,
                            color: colors.text,
                            '&:hover': {
                                borderColor: colors.inputBorderHover,
                                bgcolor: colors.inputBg
                            }
                        }}
                    >
                        Ajouter une Variable
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {deployConfig.envVars.map((envVar, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                value={envVar.key}
                                onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                                placeholder="Nom de la variable"
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: colors.inputBg,
                                        '& fieldset': {
                                            borderColor: colors.inputBorder,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.inputBorderHover,
                                        },
                                        '& input': {
                                            color: colors.text,
                                        }
                                    }
                                }}
                            />
                            <Typography variant="body1" sx={{ color: colors.textSecondary }}>=</Typography>
                            <TextField
                                value={envVar.value}
                                onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                                placeholder="Valeur"
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: colors.inputBg,
                                        '& fieldset': {
                                            borderColor: colors.inputBorder,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.inputBorderHover,
                                        },
                                        '& input': {
                                            color: colors.text,
                                        }
                                    }
                                }}
                            />
                            {deployConfig.envVars.length > 1 && (
                                <IconButton
                                    color="error"
                                    onClick={() => removeEnvVar(index)}
                                    size="small"
                                    sx={{ color: '#f44336' }}
                                >
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

export default AdvancedConfiguration;