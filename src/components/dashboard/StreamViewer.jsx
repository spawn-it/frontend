'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
    Clear as ClearIcon,
    Pause as PauseIcon,
    PlayArrow as PlayIcon,
    Download as DownloadIcon
} from '@mui/icons-material';

const StreamViewer = ({ clientId, serviceId, colors }) => {
    const [logs, setLogs] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null);
    const logsContainerRef = useRef(null);
    const pausedLogsRef = useRef([]);

    const streamUrl = `http://localhost:8000/api/clients/${encodeURIComponent(clientId)}/${encodeURIComponent(serviceId)}/stream`;

    const decodeEscapedChars = (text) => {
        try {
            return JSON.parse(`"${text}"`);
        } catch {
            return text.replace(/\\n/g, '\n');
        }
    };

    const handleNewLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = {
            id: Date.now() + Math.random(),
            timestamp,
            message,
            type
        };

        if (!isPaused) {
            setLogs(prevLogs => [...prevLogs, newLog].slice(-1000));
        } else {
            pausedLogsRef.current.push(newLog);
        }
    };

    useEffect(() => {
        if (isPaused) return;

        const connectEventSource = () => {
            try {
                eventSourceRef.current = new EventSource(streamUrl);

                eventSourceRef.current.onopen = () => {
                    setIsConnected(true);
                    setError(null);
                };

                eventSourceRef.current.onmessage = (event) => {
                    handleNewLog(event.data, 'info');
                };

                eventSourceRef.current.addEventListener('data', (event) => {
                    handleNewLog(event.data, 'stdout');
                });

                eventSourceRef.current.addEventListener('error', (event) => {
                    handleNewLog(event.data, 'stderr');
                });

                eventSourceRef.current.addEventListener('end', (event) => {
                    try {
                        const statusData = JSON.parse(event.data);
                        handleNewLog(`Command completed with status: ${statusData.applied ? 'SUCCESS' : 'FAILED'}`, 'status');
                    } catch {
                        handleNewLog(event.data, 'status');
                    }
                });

                eventSourceRef.current.onerror = () => {
                    setError('Erreur de connexion au stream');
                    setIsConnected(false);
                };

            } catch (err) {
                setError('Impossible de se connecter au stream');
                setIsConnected(false);
            }
        };

        connectEventSource();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [streamUrl, isPaused]);

    useEffect(() => {
        if (logsContainerRef.current && !isPaused) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs, isPaused]);

    const handleClearLogs = () => {
        setLogs([]);
        pausedLogsRef.current = [];
    };

    const handleTogglePause = () => {
        setIsPaused(prev => {
            if (prev) {
                setLogs(prevLogs => [...prevLogs, ...pausedLogsRef.current].slice(-1000));
                pausedLogsRef.current = [];
            }
            return !prev;
        });
    };

    const handleDownloadLogs = () => {
        const allLogs = [...logs, ...pausedLogsRef.current];
        const logText = allLogs.map(log => `[${log.timestamp}] ${decodeEscapedChars(log.message)}`).join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `service-${serviceId}-logs-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getConnectionStatus = () => {
        if (error) return { text: 'Erreur', color: '#f44336' };
        if (isConnected) return { text: 'Connecté', color: '#4caf50' };
        return { text: 'Déconnecté', color: '#ff9800' };
    };

    const status = getConnectionStatus();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                pb: 1,
                borderBottom: `1px solid ${colors.border}`
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: status.color,
                            animation: isConnected ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                                '100%': { opacity: 1 }
                            }
                        }} />
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            {status.text}
                        </Typography>
                    </Box>
                    {isPaused && (
                        <Typography variant="body2" sx={{ color: '#ff9800' }}>
                            • Pause ({pausedLogsRef.current.length} logs en attente)
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={isPaused ? "Reprendre" : "Pause"}>
                        <span>
                        <IconButton onClick={handleTogglePause} size="small" sx={{ color: colors.text }}>
                            {isPaused ? <PlayIcon /> : <PauseIcon />}
                        </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Télécharger les logs">
                        <span>
                        <IconButton onClick={handleDownloadLogs} size="small" sx={{ color: colors.text }} disabled={logs.length === 0 && pausedLogsRef.current.length === 0}>
                            <DownloadIcon />
                        </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Vider les logs">
                    <span>
                        <IconButton onClick={handleClearLogs} size="small" sx={{ color: colors.text }}>
                            <ClearIcon />
                        </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>

            <Box
                ref={logsContainerRef}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    bgcolor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: 1,
                    p: 2,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: colors.inputBg,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: colors.border,
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: colors.inputBorder,
                    },
                }}
            >
                {error && (
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(244,67,54,0.1)', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ color: '#f44336' }}>{error}</Typography>
                    </Box>
                )}

                {logs.length === 0 && !error && (
                    <Typography variant="body2" sx={{ color: colors.textMuted, fontStyle: 'italic' }}>
                        En attente des logs...
                    </Typography>
                )}

                {logs.map((log) => (
                    <Box key={log.id} sx={{ mb: 0.5, wordBreak: 'break-word' }}>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: colors.textMuted, mr: 1, fontSize: '0.75rem' }}
                        >
                            [{log.timestamp}]
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{
                                color: colors.text,
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace'
                            }}
                        >
                            {decodeEscapedChars(log.message)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default StreamViewer;
