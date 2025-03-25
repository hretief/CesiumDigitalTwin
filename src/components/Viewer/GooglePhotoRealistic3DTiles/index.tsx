//Cesium imports
import { Cesium3DTileset as Cesium3DdTilesetType, createGooglePhotorealistic3DTileset, Cartesian3, HeadingPitchRoll } from 'cesium';
import { Cesium3DTileset, useCesium, createCesiumComponent } from 'resium';

//React imports
import { useEffect } from 'react';

//Redux imports

//Local imports
import {} from '../../Theme/state/themeSlice';

export default function GooglePhotoRealistic3DTiles(props: any) {
    const { viewer } = useCesium();

    /*
const CesiumComponent = createCesiumComponent({
    name: 'googlePhotoTile',

    create() {
        console.log('Creating Google Photorealistic 3D Tileset');
        createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true }).then((tileset) => {
            if (viewer && viewer.scene) {
                viewer.scene.primitives.add(tileset);
            }
        });
    },
});

*/
    var mytiles: Cesium3DdTilesetType | undefined;

    useEffect(() => {
        const fetchTiles = async () => {
            try {
                mytiles = await createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true });
                if (viewer && viewer.scene) {
                    viewer.scene.primitives.add(mytiles);
                }
            } catch (e) {
                console.log(`Error reported while processing iTwin ${props.itwinId} from Components/RealityMesh Component: ${e}`);
            }
        };
        fetchTiles();
    }, [viewer?.scene]);

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
        </>
    );
}
