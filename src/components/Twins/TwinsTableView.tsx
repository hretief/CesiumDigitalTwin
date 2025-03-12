import { useEffect, useState, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import TwinView from './TwinView';
import { fetchTwins } from './api';


function TwinsTableView() {
    const auth = useAuth();
    const isFirstRender = useRef(true);

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    const [twins, setTwins] = useState([]);
    const [selectedTwin, setSelectedTwin] = useState(4);

    const columns: GridColDef[] = [
        { field: 'number', headerName: 'Number', width: 350 },
        { field: 'displayName', headerName: 'Name', width: 450 },
        { field: 'type', headerName: 'Type', width: 250 },
        { field: 'subClass', headerName: 'Twin Type', width: 250 },
    ];

    const handleClick = (e: any) => {
        setSelectedTwin(e.row.id);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            const fetchData = async () => {
                const returnedData = await fetchTwins(token);
                const json = await returnedData;
                setTwins(json);
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
                    <DataGrid rows={twins} columns={columns} loading={!twins.length} pagination onRowClick={handleClick} />
                </Box>
            </div>
        </>
    );
}

export default TwinsTableView;
