//Cesium imports
import { Cesium3DTileset as Cesium3DdTilesetType, ITwinPlatform, ITwinData } from 'cesium';
import { Entity, Cesium3DTileset, useCesium } from 'resium';

//React imports
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

//Local imports
import {} from '../../Theme/state/themeSlice';

interface IRealityMeshProps {
    itwinId: string;
    id: string;
    displayName: string;
    type: string;
}

export default function RealityMesh(props: IRealityMeshProps) {
    const auth = useAuth();
    const { scene, viewer } = useCesium();

    var mytiles: Cesium3DdTilesetType | undefined;
    var token: string | undefined;

    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }

    console.log(`Paining Realit yMesh for: ${props.displayName}`);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                ITwinPlatform.defaultAccessToken = token;
                mytiles = await ITwinData.createTilesetForRealityDataId(props.itwinId, props.id);
                scene?.primitives.add(mytiles);
                console.log(`myfiles URL to the tileset for iTwin (${props.itwinId}): ${mytiles!.resource!.url! as string}`);
            } catch (e) {
                console.log(`Error reported while processing iTwin ${props.itwinId} from Components/RealityMesh Component: ${e}`);
            }
        };
        fetchUrl();
    }, [scene]);

    return (
        <>
            <Cesium3DTileset
                url={''}
                onReady={(tileset) => {
                    if (viewer) {
                        viewer.zoomTo(tileset);
                    }
                }}
            ></Cesium3DTileset>
            <Entity point={{ pixelSize: 20 }} name={props.displayName} />
        </>
    );
}
