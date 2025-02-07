import { Cesium3DTileset as Cesium3DdTileset2, ITwinPlatform, ITwinData, Cartesian3 } from 'cesium';
import { useRef, useEffect } from 'react';
import { STATION_URI } from '../../../utils/constants';

import { Cesium3DTileset, Entity } from 'resium';

interface IModelProps {
    token: string;
    imodelId: string;
    position: Cartesian3;
    name: string;
    description: string;
}

export default function CADModel(props: IModelProps) {
    const refUrl = useRef<string>(STATION_URI);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                ITwinPlatform.defaultAccessToken = props.token;
                const mytiles = await ITwinData.createTilesetFromIModelId(props.imodelId);
                refUrl.current = mytiles!.resource!.url! as string;
            } catch (e) {
                console.log(`Error reported while processing iModel ${props.imodelId} from Components/CADModel Component: ${e}`);
            }
        };
        fetchUrl();
    }, []);

    return (
        <>
            <Entity point={{ pixelSize: 20 }} name={props.name} description={props.description} position={props.position} />
            <Cesium3DTileset
                url={refUrl.current}
                /*onReady={(tileset) => {
                    refViewer.current?.cesiumElement?.zoomTo(tileset);
                }}*/
            ></Cesium3DTileset>
        </>
    );
}
