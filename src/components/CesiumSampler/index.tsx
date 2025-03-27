import { createGooglePhotorealistic3DTileset, Ion, IonGeocodeProviderType, Cartesian3, HeadingPitchRoll } from 'cesium';
import { Viewer, createCesiumComponent, useCesium, Camera, CameraFlyTo, Globe, Entity } from 'resium';
import { useEffect, useState } from 'react';

import { ION_TOKEN } from '../../utils/constants';
import { IBIMModel, IRealityMesh } from '../../classes/interfaces';
import { fetchiModelsTilesets } from '../../components/Models/api';
import { fetchRealityMeshTilesets, fetchAllRealityDataReferences } from '../../components/Models/api';
import cadmodels from '../../assets/imodels.json';
import { useAuth } from 'react-oidc-context';
import BIMModel from '../Viewer/BIMModel';
import RealityMesh from '../Viewer/RealityMesh';

export default function CesiumSamplerPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    const auth = useAuth();
    const { viewer } = useCesium();
    const [imodels, setImodels] = useState<IBIMModel[]>([]);
    const [meshes, setMeshes] = useState<IRealityMesh[]>([]);

    var token: string | undefined;

    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }

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

    return (
        <>
            <Viewer full timeline={false} animation={false} sceneModePicker={false} baseLayerPicker={false} homeButton={true}>
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
        </>
    );
}
