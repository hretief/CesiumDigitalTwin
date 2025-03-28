// APP TEXT
export const APP_TITLE = 'Sparta App';
export const APP_DESCRIPTION = 'Sparta App Description';
export const FOOTER_TEXT = `${new Date().getFullYear()}`;

export const PAGE_TITLE_HOME = 'Home';
export const PAGE_TITLE_DASHBOARD = 'Dashboard';

// UI CONSTANTS
export const FOOTER_HEIGHT = 30;
export const HEADER_HEIGHT = 60;
export const DRAWER_WIDTH = 250;

// APP THEME
export const DARK_MODE_THEME = 'dark';
export const LIGHT_MODE_THEME = 'light';

export const PORT = 3000;

//# Your test application public address
export const APP_URL = 'https://localhost:3000';
export const AUTH_AUTHORITY = 'https://ims.bentley.com';

//# Your application client ID and secret (Sparta)
export const AUTH_CLIENT_ID = 'spa-nmSEY4A9ShvRT6uCwoWeDlg6I';
export const AUTH_CLIENT_SCOPES = 'openid profile email itwin-platform';

export const AUTH_CLIENT_REDIRECT_URI = 'https://localhost:3000/signin-oidc';
export const AUTH_CLIENT_LOGOUT_URI = 'https://localhost:3000/signout-oidc';

//Data Sources
export const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
export const ITWIN_URL = 'https://api.bentley.com/itwins';
export const IMODEL_URL = 'https://api.bentley.com/imodels';
export const REALITY_DATA_URL = 'https://api.bentley.com/reality-management/reality-data';
export const LAYERS_URL = 'https://api.cesium.com/v1/assets';

export const CESIUM_TOKEN_URI = 'https://api.cesium.com/itwin/token';
export const ION_TOKEN = import.meta.env.VITE_ION_TOKEN;

// Google
export const GOOGLE_AIRQUALITY_TILES_URI = import.meta.env.VITE_GOOGLE_AIRQUALITY_TILES_URI;
export const GOOGLE_SERVICE_ACCOUNT = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT;
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
