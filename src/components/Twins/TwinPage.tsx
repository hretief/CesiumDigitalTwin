import { useAuth } from 'react-oidc-context';

import { PageTitle } from '../PageTitle';
import TwinsTableView from './TwinsTableView';

function UserPage() {
    const auth = useAuth();

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    return (
        <>
            <PageTitle title="Digital Twins" />
            <TwinsTableView></TwinsTableView>
        </>
    );
}

export default UserPage;
