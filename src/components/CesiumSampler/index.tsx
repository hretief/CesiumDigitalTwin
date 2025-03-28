import { Viewer as CesiumViewer, createGooglePhotorealistic3DTileset, Ion, IonGeocodeProviderType, Cartesian3, HeadingPitchRoll, BoundingSphere, Terrain } from 'cesium';
import { Viewer, createCesiumComponent, useCesium, Camera, CameraFlyTo, Globe, Entity, CesiumComponentRef } from 'resium';
import { useEffect, useState, useRef } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Home from '@mui/icons-material/Home';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useSelector } from 'react-redux';
import { useAuth } from 'react-oidc-context';

import { ION_TOKEN } from '../../utils/constants';
import { IBIMModel, IRealityMesh, IModelBoundingSphere } from '../../classes/interfaces';
import { fetchiModelsTilesets } from '../../services/api';
import { fetchRealityMeshTilesets, fetchAllRealityDataReferences } from '../../services/api';
import cadmodels from '../../assets/imodels.json';

import BIMModel from '../Viewer/BIMModel';
import RealityMesh from '../Viewer/RealityMesh';
import IonKmlDatasource from '../../components/Viewer/IonKmlDatasource';
import { useLogger } from '../../components/LoggerProvider';
import { RootState } from '../../store';
import GooglePhotoRealisticTiles from '../../components/Viewer/GooglePhotoRealistic3DTiles';

export default function CesiumSamplerPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    const auth = useAuth();
    const { logMessage } = useLogger();
    const [imodels, setImodels] = useState<IBIMModel[]>([]);
    const [meshes, setMeshes] = useState<IRealityMesh[]>([]);
    const modelBoundingSpheres: IModelBoundingSphere[] = useSelector((state: RootState) => state.viewerRed as IModelBoundingSphere[]);
    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);

    var token: string | undefined;
    var isLoggedIn: Boolean = auth.isAuthenticated;

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

            <SpeedDial ariaLabel="Digital Twins" sx={{ position: 'relative', top: '50%' }} icon={<SpeedDialIcon />}>
                <SpeedDialAction icon={<Home />} tooltipTitle={'Home'} tooltipOpen sx={{ '& .MuiSpeedDialAction-staticTooltipLabel': { width: '16rem' } }} onClick={() => refViewer.current?.cesiumElement?.camera.flyHome(1)} />
                {imodels.map((model) => (
                    <SpeedDialAction icon={<QrCodeIcon />} key={model.id} tooltipTitle={model.itwinname} tooltipOpen sx={{ '& .MuiSpeedDialAction-staticTooltipLabel': { width: '16rem' } }} onClick={() => handleSpeedDialClick(model)} />
                ))}
            </SpeedDial>
        </>
    );
}
