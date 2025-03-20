// #region Imports
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Drawer } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// #region Cesium imports
import { Viewer as CesiumViewer, SceneMode, Ion, GoogleMaps, HeadingPitchRange, BoundingSphere, IonGeocodeProviderType } from 'cesium';
import { Viewer, Scene, CesiumComponentRef, Globe } from 'resium';
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
import GooglePhotoRealisticTiles from './GooglePhotoRealistic3DTiles';
import { IBIMModel, IRealityMesh, IAttrib, IElement, IModelBoundingSphere } from '../../classes/interfaces';
import attribs from '../../assets/attribs.json';
import { RootState } from '../../store';
import { DRAWER_STATE } from './state/drawerSlice';
import { UPD_SELECTED_ELEMENT } from './BIMModel/state/elementSlice';
import { GOOGLE_MAPS_KEY, ION_TOKEN } from '../../utils/constants';
import { fetchRealityMesh3DTiles } from './RealityMesh/api';

//import { fetchiTwinRealityDataReferences } from './RealityMesh/api';
// #endregion

// #endregion

// #region Global variables

const elemAttribs: IAttrib[] = attribs.attribs;
let meshes: IRealityMesh[] = [];
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
    const isFirstRender = useRef(true);
    const dispatch = useDispatch();

    const currentSelectedElement: IElement = useSelector((state: RootState) => state.element as IElement);
    const modelBoundingSpheres: IModelBoundingSphere[] = useSelector((state: RootState) => state.viewerRed as IModelBoundingSphere[]);
    const drawerState: boolean = useSelector((state: RootState) => state.drawers.open);
    const currentTwinsScene: IBIMModel[] = useSelector((state: RootState) => state.scene);
    const defaultAnchor: Anchor = 'right';
    // #endregion

    // #region Event Handlers
    const toggleDrawer = (isopen: boolean) => () => {
        dispatch(DRAWER_STATE({ open: isopen }));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        if (newValue.id !== 0) {
            // Find the tileset for this iModel and fly to it
            const bs: BoundingSphere = modelBoundingSpheres.filter((x) => x.imodelId === newValue.id)[0].boundingSphere;
            refViewer.current?.cesiumElement?.camera.viewBoundingSphere(bs, new HeadingPitchRange(0, -0.5, 0));
        } else {
            refViewer.current?.cesiumElement?.camera.flyHome(1);
        }
    };
    // #endregion

    // #region Main Code

    cadmodels = currentTwinsScene; // need to store the loaded cadmodes in redux...

    useEffect(() => {
        // Find al the reality meshes for the iTwin
        const fetchRealityData = async (token: string | undefined, iTwinId: string) => {
            const returnedData = await fetchRealityMesh3DTiles(token, iTwinId);
            const json = await returnedData.realityData;
            return (json as IRealityMesh[]).filter((x) => x.type === 'RealityMesh3DTiles');
        };

        const fetchAllRealityData = async () => {
            for (const itwin of cadmodels) {
                let itwinMeshes: IRealityMesh[] = await fetchRealityData(token, itwin.itwinid);
                let i: number = 0;
                while (itwinMeshes[i]) {
                    itwinMeshes[i].itwinid = itwin.itwinid;
                    i++;
                }

                meshes.push(...itwinMeshes);
            }
        };

        fetchAllRealityData();
    }, [cadmodels]);

    useEffect(() => {
        if (isFirstRender.current) {
            dispatch(DRAWER_STATE({ open: false }));
            dispatch(UPD_SELECTED_ELEMENT(undefined));

            if (!currentSelectedElement) {
                toggleDrawer(false);
            }
        }

        isFirstRender.current = false;

        // ---> StrictMode: The following is REQUIRED to reset/cleanup:
        return () => {
            isFirstRender.current = true;
        };
    }, []); // ---> The `[]` is required, it won't work with `[myDependency]` etc.

    // #endregion
    const drawerWidth = '25%';

    // #region Render code
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs aria-label="basic tabs example" onChange={handleChange} value={false}>
                    <Tab label={'Home'} value={{ id: 0, lat: 0, lng: 0, height: 0 }} />
                    {cadmodels
                        //.filter((x) => x !== undefined)
                        .map((model) => (
                            <Tab label={model.displayName} value={{ id: model.id }} />
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
                        <GooglePhotoRealisticTiles></GooglePhotoRealisticTiles>
                        {cadmodels.map((model) => (
                            <BIMModel imodelId={model.id} name={model.displayName} description={model.description}></BIMModel>
                        ))}
                        {meshes.map((mesh) => (
                            <RealityMesh itwinId={mesh.itwinid} id={mesh.id} displayName={mesh.displayName} type={mesh.type}></RealityMesh>
                        ))}
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

/*





                <Viewer animation={false} navigationHelpButton={true} selectionIndicator={false} homeButton={false} infoBox={false} timeline={false} ref={refViewer} style={{ position: 'absolute', top: 150, left: 0, right: 0, bottom: 0 }}>
                    <Scene mode={SceneMode.SCENE3D} morphDuration={10}>
                        {cadmodels.map((model) => (
                            <BIMModel imodelId={model.id} position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)} name={model.displayName} description={model.description}></BIMModel>
                        ))}
                        {meshes.map((mesh) => (
                            <RealityMesh itwinId={currentTwinId.current} id={mesh.id} displayName={mesh.displayName} type={mesh.type}></RealityMesh>
                        ))}
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

*/
