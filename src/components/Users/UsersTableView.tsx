import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import UserView from './UserView';
import { fetchGET } from '../../utils/fetchAPI';

function UsersTableView() {
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
        const fetchData = async () => {
            const returnedData = await fetchGET('https://jsonplaceholder.typicode.com/users');
            const json = await returnedData;
            setUsers(json);
        };
        fetchData();
    }, [users]);

    return (
        <>
            <div>
                <Box>
                    <DataGrid rows={users} columns={columns} loading={!users.length} pagination onRowClick={handleClick} />
                </Box>
            </div>
        </>
    );
}

export default UsersTableView;
