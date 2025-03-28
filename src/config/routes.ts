import {
    Home as HomeIcon,
    BarChartOutlined as DashboardIcon,
    CodeOutlined as CodeIcon,
    GitHub as GitHubIcon,
    Public as PublicIcon,
    PublicOff as PrivateIcon,
    AccountBoxRounded as UserIcon,
    SettingsOutlined as SettingsIcon,
    ListAlt as ListIcon,
    Map as MapIcon,
    Handyman as ProjectIcon,
    WebAsset as BrowserIcon,
    Factory as FacilityIcon,
    HeatPump as EquipIcon,
    People as People,
    Satellite as Satellite,
    ThreeDRotation as Globe,
} from '@mui/icons-material';

import { Home } from '../pages/Home';
import { PageDefault as Dashboard } from '../components/PageDefault';
import UsersPage from '../components/Users/UserPage';
import CesiumPage from '../components/Viewer';
import TwinsPage from '../components/Twins/TwinPage';
import LayerPage from '../components/Layers/LayerPage';
/*
import Counter from '../components/counter/Counter';

import SegmentsPage from '../components/segments/SegmentsPage';
import FacilitiesPage from '../components/Facilities/FacilitiesPage';

*/

import { Route } from '../types/Route';

const routes: Array<Route> = [
    {
        key: 'router-home',
        title: 'Home',
        description: 'Home',
        component: Home,
        path: '/',
        isEnabled: true,
        icon: HomeIcon,
        appendDivider: true,
    },
    {
        key: 'router-dashboard',
        title: 'Dashboard',
        description: 'Dashboard',
        component: Dashboard,
        path: '/dashboard',
        isEnabled: true,
        icon: DashboardIcon,
    },
    {
        key: 'router-users',
        title: 'Users',
        description: 'Interop Tenant Users',
        component: UsersPage,
        path: '/tenant-users',
        isEnabled: true,
        icon: People,
        appendDivider: true,
    },
    {
        key: 'router-twins',
        title: 'Twins',
        description: 'Digital Twins',
        component: TwinsPage,
        path: '/tenant-twins',
        isEnabled: true,
        icon: Satellite,
        appendDivider: true,
    },
    {
        key: 'router-layer',
        title: 'Layers',
        description: 'Layers',
        component: LayerPage,
        path: '/tenant-layer',
        isEnabled: true,
        icon: MapIcon,
        appendDivider: true,
    },

    {
        key: 'router-viewer',
        title: 'Digital Twin',
        description: 'World-wide Twin',
        component: CesiumPage,
        path: '/viewer',
        isEnabled: true,
        icon: Globe,
        appendDivider: true,
    },
];

export default routes;
