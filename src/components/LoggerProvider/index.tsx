import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface LoggerContextType {
    logMessage: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export const LoggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

    const logMessage = (msg: string, sev: 'success' | 'info' | 'warning' | 'error') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <LoggerContext.Provider value={{ logMessage }}>
            {children}

            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </LoggerContext.Provider>
    );
};

export const useLogger = () => {
    const context = useContext(LoggerContext);
    if (context === undefined) {
        throw new Error('useLogger must be used within a LoggerProvider');
    }
    return context;
};
