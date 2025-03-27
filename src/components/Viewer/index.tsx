// #region Imports
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Drawer, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// #region Cesium imports
import { Viewer as CesiumViewer, SceneMode, Ion, GoogleMaps, BoundingSphere, IonGeocodeProviderType, Cartesian3 } from 'cesium';
import { Viewer, Scene, CesiumComponentRef, Globe, Entity, useCesium } from 'resium';
// #endregion

// #region React imports
import { useRef, useState, Fragment, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
// #endregion

// #region Redux imports
import { useSelector, useDispatch } from 'react-redux';
// #endregion

// #region Local imports
import BIMModel from './BIMModel';
import RealityMesh from './RealityMesh';
import GoogleAirQualityTiles from './GoogleAirQualityTiles';
import IonKmlDatasource from './IonKmlDatasource';
import GooglePhotoRealisticTiles from './GooglePhotoRealistic3DTiles';
import { IBIMModel, IRealityMesh, IAttrib, IElement, IModelBoundingSphere } from '../../classes/interfaces';
import attribs from '../../assets/attribs.json';
import { RootState } from '../../store';
import { DRAWER_STATE } from './state/drawerSlice';
import { UPD_SELECTED_ELEMENT } from './BIMModel/state/elementSlice';
import { GOOGLE_MAPS_KEY, ION_TOKEN } from '../../utils/constants';

import { fetchRealityMeshTilesets, fetchAllRealityDataReferences, fetchiModelsTilesets } from '../../components/Models/api';
import models from '../../assets/imodels.json';

// #endregion

// #endregion

// #region Global variables

const elemAttribs: IAttrib[] = attribs.attribs;
let cadmodels: IBIMModel[] = [];

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const columns: GridColDef[] = [
    { field: 'Name', headerName: 'Name', width: 200 },
    { field: 'Value', headerName: 'Value', width: 250 },
];
// #endregion

export default function CesiumPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    GoogleMaps.defaultApiKey = GOOGLE_MAPS_KEY;

    const auth = useAuth();

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }
    // #region Local variables
    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const { viewer } = useCesium();
    const [imodels, setImodels] = useState<IBIMModel[]>([]);
    const [meshes, setMeshes] = useState<IRealityMesh[]>([]);
    const [loading, setLoading] = useState(false); // State to track loading
    const [progress, setProgress] = useState(0); // State to track progress percentage

    const currentSelectedElement: IElement = useSelector((state: RootState) => state.element as IElement);
    const modelBoundingSpheres: IModelBoundingSphere[] = useSelector((state: RootState) => state.viewerRed as IModelBoundingSphere[]);
    const drawerState: boolean = useSelector((state: RootState) => state.drawers.open);
    const currentTwinsScene: IBIMModel[] = useSelector((state: RootState) => state.scene);
    const defaultAnchor: Anchor = 'right';
    cadmodels = models; //currentTwinsScene; // need to store the loaded cadmodes in redux...
    // #endregion

    // #region Event Handlers
    const toggleDrawer = (isopen: boolean) => () => {
        dispatch(DRAWER_STATE({ open: isopen }));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        if (newValue.id !== 0) {
            // Find the tileset for this iModel and fly to it
            const matchingSphere = modelBoundingSpheres.find((x) => x.imodelId === newValue?.id);
            if (matchingSphere?.boundingSphere) {
                const bs: BoundingSphere = matchingSphere.boundingSphere;
                refViewer.current?.cesiumElement?.camera.flyToBoundingSphere(bs, { duration: 2 });
            } else {
                console.warn('Bounding sphere not found for the selected model.');
                refViewer.current?.cesiumElement?.camera.flyHome(1);
            }
        } else {
            refViewer.current?.cesiumElement?.camera.flyHome(1);
        }
    };
    // #endregion

    // #region Main Code

    useEffect(() => {
        if (refViewer.current?.cesiumElement) {
            // Add event listener for tile loading progress
            refViewer.current?.cesiumElement?.scene.globe.tileLoadProgressEvent.addEventListener((tilesLoading) => {
                if (tilesLoading > 0) {
                    setLoading(true);
                    setProgress((prev) => Math.min(100, prev + 10)); // Simulate progress
                } else {
                    setLoading(false);
                    setProgress(100); // Set progress to 100% when done
                }
            });
        }
    }, [refViewer]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const iModels: IBIMModel[] = await fetchiModelsTilesets(token, cadmodels);
                setImodels(iModels);

                const refs: IRealityMesh[] = await fetchAllRealityDataReferences(token, cadmodels);
                const meshes: IRealityMesh[] = await fetchRealityMeshTilesets(token, refs);
                setMeshes(meshes);
            } catch (e) {
                console.log(`Token: ${token}`);
                console.log(`Error reported while processing iModel Component: ${e}`);
            }
        };
        fetchData();
    }, [viewer]);

    useEffect(() => {
        dispatch(DRAWER_STATE({ open: false }));
        dispatch(UPD_SELECTED_ELEMENT(undefined));

        if (!currentSelectedElement) {
            toggleDrawer(false);
        }
    }, []);

    // #endregion
    const drawerWidth = '25%';

    // #region Render code
    return (
        <>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                    }}
                >
                    <CircularProgress variant="determinate" value={progress} />
                </Box>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs aria-label="basic tabs example" onChange={handleChange} value={false}>
                    <Tab label={'Home'} value={{ id: 0, lat: 0, lng: 0, height: 0 }} />
                    {imodels.map((model) => (
                        <Tab label={model.itwinname} value={{ id: model.id }} />
                    ))}
                </Tabs>
            </Box>

            <Grid>
                <Viewer
                    baseLayer={false}
                    geocoder={IonGeocodeProviderType.GOOGLE}
                    //globe={false}
                    animation={false}
                    navigationHelpButton={true}
                    selectionIndicator={false}
                    homeButton={false}
                    infoBox={false}
                    timeline={false}
                    sceneModePicker={false}
                    baseLayerPicker={false}
                    ref={refViewer}
                    style={{ position: 'absolute', top: 150, left: 0, right: 0, bottom: 0 }}
                >
                    <Globe show={false} />

                    <Scene mode={SceneMode.SCENE3D} morphDuration={10}>
                        {imodels.map((model) => (
                            <BIMModel imodelId={model.id} name={model.displayName} description={model.description} heightcorrection={model.heightcorrection} tilesUrl={model.tilesUrl}></BIMModel>
                        ))}
                        {meshes.map((mesh) => (
                            <RealityMesh itwinId={mesh.itwinid} id={mesh.id} displayName={mesh.displayName} type={mesh.type} heightcorrection={mesh.heightcorrection} tilesUrl={mesh.tilesUrl}></RealityMesh>
                        ))}

                        {cadmodels.map((model) => (
                            <Entity point={{ pixelSize: 20 }} name={model.itwinname} description={model.displayName} position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)}></Entity>
                        ))}
                        <GooglePhotoRealisticTiles></GooglePhotoRealisticTiles>
                    </Scene>
                </Viewer>
                <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                    <Fragment key={defaultAnchor}>
                        <Drawer
                            sx={{
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '80%', top: '15%' },
                                zIndex: 1,
                            }}
                            anchor={defaultAnchor}
                            open={drawerState}
                            onClose={toggleDrawer(false)}
                        >
                            <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                                <Box>
                                    <DataGrid rows={elemAttribs} columns={columns} loading={!elemAttribs.length} pagination />
                                </Box>
                            </Box>
                        </Drawer>
                    </Fragment>
                </Box>

                <Box>
                    <BottomNavigation
                        sx={{ position: 'absolute', bottom: 100, right: 500 }}
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
                    </BottomNavigation>
                </Box>
            </Grid>
        </>
    );

    // #endregion
}
