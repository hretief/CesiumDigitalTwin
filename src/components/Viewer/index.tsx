import { Viewer as CesiumViewer, createGooglePhotorealistic3DTileset, Ion, IonGeocodeProviderType, Cartesian3, HeadingPitchRoll, BoundingSphere, Terrain } from 'cesium';
import { Viewer, createCesiumComponent, useCesium, Camera, CameraFlyTo, Globe, Entity, CesiumComponentRef } from 'resium';
import { useEffect, useState, useRef, Fragment } from 'react';
import { SpeedDial, SpeedDialAction, Box, Drawer } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import QrCodeIcon from '@mui/icons-material/QrCode';
import Home from '@mui/icons-material/Home';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'react-oidc-context';

import { ION_TOKEN } from '../../utils/constants';
import { IBIMModel, IRealityMesh, IModelBoundingSphere, IAttrib, IElement } from '../../classes/interfaces';
import { fetchiModelsTilesets } from '../../services/api';
import { fetchRealityMeshTilesets, fetchAllRealityDataReferences } from '../../services/api';
import cadmodels from '../../assets/imodels.json';

import BIMModel from './BIMModel';
import RealityMesh from './RealityMesh';
import IonKmlDatasource from './IonKmlDatasource';
import { useLogger } from '../LoggerProvider';
import { RootState } from '../../store';
import attribs from '../../assets/attribs.json';
import { DRAWER_STATE } from './state/drawerSlice';
import { UPD_SELECTED_ELEMENT } from './BIMModel/state/elementSlice';
import GooglePhotoRealisticTiles from './GooglePhotoRealistic3DTiles';

const elemAttribs: IAttrib[] = attribs.attribs;
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const columns: GridColDef[] = [
    { field: 'Name', headerName: 'Name', width: 200 },
    { field: 'Value', headerName: 'Value', width: 250 },
];

export default function CesiumSamplerPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    const auth = useAuth();
    const { logMessage } = useLogger();
    const dispatch = useDispatch();
    const [imodels, setImodels] = useState<IBIMModel[]>([]);
    const [meshes, setMeshes] = useState<IRealityMesh[]>([]);
    const modelBoundingSpheres: IModelBoundingSphere[] = useSelector((state: RootState) => state.viewerRed as IModelBoundingSphere[]);
    const currentSelectedElement: IElement = useSelector((state: RootState) => state.element as IElement);
    const drawerState: boolean = useSelector((state: RootState) => state.drawers.open);
    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);

    var token: string | undefined;
    var isLoggedIn: Boolean = auth.isAuthenticated;
    const drawerWidth = '25%';

    const toggleDrawer = (isopen: boolean) => () => {
        dispatch(DRAWER_STATE({ open: isopen }));
    };

    useEffect(() => {
        if (isLoggedIn) {
            token = auth.user?.access_token;
        } else {
            auth.signinRedirect();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        refViewer.current?.cesiumElement?.terrainProvider;
        const fetchData = async () => {
            try {
                const iModels: IBIMModel[] = await fetchiModelsTilesets(token, cadmodels);
                setImodels(iModels);

                const refs: IRealityMesh[] = await fetchAllRealityDataReferences(token, cadmodels);
                const meshes: IRealityMesh[] = await fetchRealityMeshTilesets(token, refs);
                setMeshes(meshes);
            } catch (e) {
                console.log(`Token: ${token}`);
                logMessage(`Error reported while processing iModel Component: ${e}`, 'error');
            }
        };
        fetchData();
    }, [refViewer]);

    useEffect(() => {
        dispatch(DRAWER_STATE({ open: false }));
        dispatch(UPD_SELECTED_ELEMENT(undefined));

        if (!currentSelectedElement) {
            toggleDrawer(false);
        }
    }, []);    

    const handleSpeedDialClick = (model: IBIMModel) => {
        logMessage(`Selected: ${model.displayName} `, 'info');

        if (model && model.id.length !== 0) {
            // Find the tileset for this iModel and fly to it
            const matchingSphere = modelBoundingSpheres.find((x) => x.imodelId === model.id);
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

    return (
        <>
            <Viewer full timeline={false} animation={false} sceneModePicker={false} baseLayerPicker={false} homeButton={true} ref={refViewer} geocoder={IonGeocodeProviderType.GOOGLE}>
                <Globe show={false} />
                <GooglePhotoRealisticTiles></GooglePhotoRealisticTiles>
                <IonKmlDatasource ionId={3123950} />
                {meshes.map((mesh) => (
                    <RealityMesh itwinId={mesh.itwinid} id={mesh.id} displayName={mesh.displayName} type={mesh.type} heightcorrection={mesh.heightcorrection} tilesUrl={mesh.tilesUrl}></RealityMesh>
                ))}
                {imodels.map((model) => (
                    <BIMModel imodelId={model.id} name={model.displayName} description={model.description} heightcorrection={model.heightcorrection} tilesUrl={model.tilesUrl}></BIMModel>
                ))}
                {imodels.map((model) => (
                    <Entity point={{ pixelSize: 20 }} name={model.itwinname} description={model.displayName} position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)} />
                ))}
            </Viewer>

            <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Fragment key={'right'}>
                    <Drawer
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '80%', top: '15%' },
                            zIndex: 1,
                        }}
                        anchor={'right'}
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

            <SpeedDial ariaLabel="Digital Twins" sx={{ position: 'relative', top: '50%' }} icon={<SpeedDialIcon />}>
                <SpeedDialAction icon={<Home />} tooltipTitle={'Home'} tooltipOpen sx={{ '& .MuiSpeedDialAction-staticTooltipLabel': { width: '16rem' } }} onClick={() => refViewer.current?.cesiumElement?.camera.flyHome(1)} />
                {imodels.map((model) => (
                    <SpeedDialAction icon={<QrCodeIcon />} key={model.id} tooltipTitle={model.itwinname} tooltipOpen sx={{ '& .MuiSpeedDialAction-staticTooltipLabel': { width: '16rem' } }} onClick={() => handleSpeedDialClick(model)} />
                ))}
            </SpeedDial>
        </>
    );
}
