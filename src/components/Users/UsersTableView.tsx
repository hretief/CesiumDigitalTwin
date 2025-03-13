import { useEffect, useState, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import UserView from './UserView';
import { fetchUsers } from './api';

function UsersTableView() {
    const auth = useAuth();
    const isFirstRender = useRef(true);

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(4);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'username', headerName: 'User Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
    ];

    const handleClick = (e: any) => {
        setSelectedUser(e.row.id);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            const fetchData = async () => {
                const returnedData = await fetchUsers();
                const json = await returnedData;
                setUsers(json);
            };
            fetchData();
        }
        isFirstRender.current = false;

        return () => {
            isFirstRender.current = true;
        };
    }, []);

    return (
        <>
            <div>
                <Box>
                    <Grid container spacing={2}>
                        <Grid>
                            <DataGrid rows={users} columns={columns} loading={!users.length} pagination onRowClick={handleClick} />
                        </Grid>
                        <Grid>
                            <div>1</div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );
}

export default UsersTableView;
