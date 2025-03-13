import { useEffect, useState, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../store';
import { fetchTwins } from './api';
import { fetchiModelsByScene } from '../Models/api';
import { APPEND_ITWINS_SCENE, REPLACE_ITWINS_SCENE, EMPTY_ITWINS_SCENE } from '../Scenes/state/sceneSlice';
import twincolumns from '../../assets/twincolumns.json';
import { IBIMModel } from '../../classes/interfaces';

function TwinsTableView() {
    const auth = useAuth();
    const dispatch = useDispatch();
    const isFirstRender = useRef(true);

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    const currentTwinsScene: IBIMModel[] = useSelector((state: RootState) => state.scene);
    const [allTwins, setAllTwins] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = twincolumns;

    const handleSetScene = async (e: any) => {
        let allModels: IBIMModel[] = await fetchiModelsByScene(token, rowSelectionModel.join(','));

        dispatch(REPLACE_ITWINS_SCENE(allModels));
    };

    useEffect(() => {
        const updateSelectedTwins = () => {
            let selectedRows: GridRowSelectionModel = [];
            if (currentTwinsScene.length !== 0) {
                let output = currentTwinsScene.map((item) => item.itwinid).join(',');
                selectedRows = output.split(',');
                setRowSelectionModel(selectedRows);
            }
        };
        updateSelectedTwins();
    }, [currentTwinsScene]);

    useEffect(() => {
        if (isFirstRender.current) {
            const fetchData = async () => {
                const returnedData = await fetchTwins(token);
                const json = await returnedData;
                setAllTwins(json);
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
                <Button
                    variant="text"
                    disabled={currentTwinsScene.length === 0}
                    onClick={() => {
                        setRowSelectionModel([]);
                        dispatch(EMPTY_ITWINS_SCENE());
                    }}
                >
                    Reset Scene
                </Button>
                <Button variant="text" disabled={rowSelectionModel.length === 0} onClick={handleSetScene}>
                    Set Selected Scene
                </Button>
                <Box>
                    <DataGrid
                        rowSelectionModel={rowSelectionModel}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rows={allTwins}
                        columns={columns}
                        loading={!allTwins.length}
                        pagination
                        checkboxSelection
                    />
                </Box>
            </div>
        </>
    );
}

export default TwinsTableView;
