import UsersTableView from './UsersTableView';
import { PageTitle } from '../PageTitle';

function UserPage() {
    return (
        <>
        <PageTitle title="Users" />
            <UsersTableView></UsersTableView>
        </>
    );
}

export default UserPage;
