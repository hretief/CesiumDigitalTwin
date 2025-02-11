import { Cesium3DTileset as Cesium3DdTilesetType, ITwinPlatform, ITwinData, Cartesian3 } from 'cesium';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import { NUCLEAR_TILESET_URI, NOVO_TILESET_URI, OPENROADS_TILESET_URI } from '../../../utils/constants';

import { Entity, Cesium3DTileset, useCesium } from 'resium';

interface IModelProps {
    imodelId: string;
    position?: Cartesian3;
    name?: string;
    description?: string;
}

export default function BIMModel(props: IModelProps) {
    const auth = useAuth();
    const { scene, viewer } = useCesium();

    var mytiles: Cesium3DdTilesetType | undefined;
    var token: string | undefined;

    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                ITwinPlatform.defaultAccessToken = token;
                mytiles = await ITwinData.createTilesetFromIModelId(props.imodelId);
                scene?.primitives.add(mytiles);

                //console.log(`myfiles URL to the tileset for iModel (${props.imodelId}): ${mytiles!.resource!.url! as string}`);
            } catch (e) {
                console.log(`Token: ${token}`);
                console.log(`Error reported while processing iModel ${props.imodelId} from Components/BIMModel Component: ${e}`);
            }
        };
        fetchUrl();
    }, []);

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
            <Entity point={{ pixelSize: 20 }} name={props.name} description={props.description} position={props.position} />
        </>
    );
}
