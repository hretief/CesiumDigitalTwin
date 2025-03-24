import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { fetchLayers } from './api';
import { ION_TOKEN } from '../../utils/constants';

import layercolumns from '../../assets/layercolumns.json';

function LayersTableView() {
    const auth = useAuth();
    const isFirstRender = useRef(true);

    var token: string | undefined = ION_TOKEN;

    const columns: GridColDef[] = layercolumns;
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState([]);

    const handleClick = (e: any) => {
        setSelectedLayer(e.row.id);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            const fetchData = async () => {
                const returnedData = await fetchLayers(token);
                const json = await returnedData;
                setLayers(json);
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
                    <DataGrid rows={layers} columns={columns} loading={!layers.length} pagination checkboxSelection onRowClick={handleClick} />
                </Box>
            </div>
        </>
    );
}

export default LayersTableView;
