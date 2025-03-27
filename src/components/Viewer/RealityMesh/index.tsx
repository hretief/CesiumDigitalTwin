//Cesium imports
import { Cartographic, Cartesian3, Matrix4 } from 'cesium';
import { Entity, Cesium3DTileset } from 'resium';

//Local imports
import {} from '../../Theme/state/themeSlice';

interface IRealityMeshProps {
    itwinId: string;
    id: string;
    displayName: string;
    type: string;
    heightcorrection: number;
    tilesUrl?: string;
}

export default function RealityMesh(props: IRealityMeshProps) {
    return (
        <>
            <Cesium3DTileset
                url={props.tilesUrl as string}
                onReady={(tileset) => {
                    const cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center);
                    const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                    const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, props.heightcorrection); //this is where we adjust the height of the model
                    const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
                    tileset.modelMatrix = Matrix4.fromTranslation(translation);
                }}
            ></Cesium3DTileset>
            <Entity point={{ pixelSize: 20 }} name={props.displayName} />
        </>
    );
}
