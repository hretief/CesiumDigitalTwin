import { createElement, useState } from 'react';
import { styled, Box } from '@mui/material';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { FOOTER_HEIGHT } from '../../utils/constants';
import { useRoutes, RouteObject } from 'react-router-dom';
import { routes } from '../../config';
import { Route as AppRoute } from '../../types';
import { Navigation } from '../Navigation';
import { PageDefault } from '../PageDefault';
import { Home } from '../../pages/Home';
import { APP_URL, AUTH_CLIENT_REDIRECT_URI } from '../../utils/constants';

type Props = {
    children: JSX.Element;
};
var routeConfig: RouteObject[] = [];
function buildRoutes(arrRoutes: AppRoute[]): RouteObject[] {
    // Map the 'routes' json file to routes and navigation menu.
    arrRoutes.map((route: AppRoute) => {
        if (typeof route.subRoutes !== 'undefined') {
            buildRoutes(route.subRoutes);
        }

        var nod: RouteObject = {};
        var reactNode = createElement(route.component || PageDefault);
        nod.element = reactNode;
        nod.path = route.path;
        routeConfig = [...routeConfig, nod];
    });

    // Add a mandatory route for redirect URL, which should not be on the menu.
    var oidcSignout: RouteObject = {};
    var reactNode = createElement(Home);
    oidcSignout.element = reactNode;
    var p = AUTH_CLIENT_REDIRECT_URI;
    oidcSignout.path = p.replace(APP_URL, '');
    routeConfig.push(oidcSignout);

    return routeConfig;
}

function AppRoutes() {
    let element = useRoutes(buildRoutes(routes));
    return element;
}

//export function Layout({ children }) {
export const Layout = () => {
    const [open, setOpen] = useState(false);
    const toggleNavigation = () => setOpen((status) => !status);

    return (
        <LayoutWrapper>
            <ContentWrapper>
                <Box component="header">
                    <Header toggleNavigation={toggleNavigation} />
                </Box>

                <Navigation open={open} handleClose={toggleNavigation} />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <AppRoutes />
                </Box>
            </ContentWrapper>
            <Box component="footer">
                <Footer />
            </Box>
        </LayoutWrapper>
    );
};

const LayoutWrapper = styled('div')`
    min-height: 100vh;
`;

const ContentWrapper = styled('div')`
    display: flex;
    min-height: calc(100vh - ${FOOTER_HEIGHT}px);
`;
const DrawerHeader = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));
