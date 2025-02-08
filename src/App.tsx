import { useMemo, useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

import { Layout } from './components/Layout';

import { AppContext, ThemeModeContext } from './contexts';
import { AppClient } from './clients'
import { getAppTheme } from './styles/theme';
import { DARK_MODE_THEME, LIGHT_MODE_THEME } from './utils/constants';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
    const auth = useAuth();
    const [mode, setMode] = useState<typeof LIGHT_MODE_THEME | typeof DARK_MODE_THEME>(DARK_MODE_THEME);

    const appClient = new AppClient();

    const themeMode = useMemo(
        () => ({
            toggleThemeMode: () => {
                setMode((prevMode) => (prevMode === LIGHT_MODE_THEME ? DARK_MODE_THEME : LIGHT_MODE_THEME));
            },
        }),
        []
    );
    const theme = useMemo(() => getAppTheme(mode), [mode]);
    const isLoggedIn = auth.isAuthenticated;

    console.log(`is logged is ${isLoggedIn}`);
    console.log(`is authenticated is ${auth.isAuthenticated}`);
    console.log(auth.isAuthenticated);

    /*
    useEffect(() => {
        if (!isLoggedIn) {
            auth.signinRedirect();
        }
    }, [isLoggedIn]);
*/

    return (
        <>
            <AppContext.Provider value={appClient}>
                <Provider store={store}>
                    <ThemeModeContext.Provider value={themeMode}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Router>
                                <Layout></Layout>
                            </Router>
                        </ThemeProvider>
                    </ThemeModeContext.Provider>
                </Provider>
            </AppContext.Provider>
        </>
    );
}

export default App;
