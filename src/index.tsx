import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

import Configuration from './components/Authentication/config';
import { Config } from './components/Authentication/models';

import App from './App.tsx';

const config: Config = Configuration.read();
const oidcConfig = {
    authority: config.Authority,
    client_id: config.ClientId,
    redirect_uri: config.RedirectUri,
    scope: config.Scopes,
    // ...
};

createRoot(document.getElementById('root')!).render(
    <AuthProvider {...oidcConfig}>
        <StrictMode>
            <App />
        </StrictMode>
    </AuthProvider>
);
