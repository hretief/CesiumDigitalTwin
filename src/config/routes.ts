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
    CreditCard as BillingIcon,
    Handyman as ProjectIcon,
    WebAsset as BrowserIcon,
    Factory as FacilityIcon,
    HeatPump as EquipIcon,
    People as People,
} from '@mui/icons-material';

import { Home } from '../pages/Home';
import { PageDefault as Dashboard } from '../components/PageDefault';
import UsersPage from '../components/Users/UserPage';
import CesiumPage from '../components/Cesium';
/*
import Counter from '../components/counter/Counter';
import ProjectsPage from '../components/projects/ProjectsPage';
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
        key: 'router-cesium',
        title: 'Cesium',
        description: 'Cesium',
        component: CesiumPage,
        path: '/cesium',
        isEnabled: true,
        icon: CodeIcon,
        appendDivider: true,
    },
];

export default routes;
