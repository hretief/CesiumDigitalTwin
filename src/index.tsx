import React from 'react';

import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';

import Configuration from './components/Authentication/config';
import { Config } from './components/Authentication/models';

const container = document.getElementById('root')!;
const root = createRoot(container);

const config: Config = Configuration.read();

const oidcConfig = {
    authority: config.Authority,
    client_id: config.ClientId,
    redirect_uri: config.RedirectUri,
    scope: config.Scopes,
    // ...
};

root.render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
