import { useAuth } from 'react-oidc-context';

import TwinsTableView from './TwinsTableView';

function UserPage() {
    const auth = useAuth();

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    return <TwinsTableView></TwinsTableView>;
}

export default UserPage;
