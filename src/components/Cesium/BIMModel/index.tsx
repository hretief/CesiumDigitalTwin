//Cesium imports
import { ScreenSpaceEventType, Cesium3DTileFeature, Color, Cesium3DTileset as Cesium3DdTilesetType, ITwinPlatform, ITwinData, Cartesian3, ScreenSpaceEventHandler as CesiumScreenSpaceEventHandler } from 'cesium';
import { Entity, Cesium3DTileset, useCesium, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';

//React imports
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

//Redux imports
import { useDispatch } from 'react-redux';

//Local imports
import { IElement } from '../../../classes/interfaces/IElement';
import { UPD_SELECTED_ELEMENT } from './state/elementSlice';
import {   } from "../../Theme/state/themeSlice";
import { DRAWER_STATE } from '../state/drawerSlice';

interface IModelProps {
    imodelId: string;
    position?: Cartesian3;
    name?: string;
    description?: string;
}

const unselectFeature = (feature: any) => {
    if (!feature) return;

    feature.color = Color.clone(Color.WHITE, feature.color);
    return undefined;
};

const selectFeature = (feature: any) => {
    feature.color = Color.clone(Color.fromCssColorString('#eeff41'), feature.color);
    return feature;
};

export default function BIMModel(props: IModelProps) {
    const auth = useAuth();
    const { scene, viewer } = useCesium();
    const [picking, setPicking] = useState(true);
    const dispatch = useDispatch();

    var mytiles: Cesium3DdTilesetType | undefined;
    var selectedFeature: any | undefined;
    var selectedElement: string | undefined;
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

        const handler = new CesiumScreenSpaceEventHandler(scene?.canvas);
        handler.setInputAction((movement: any) => {
            if (!picking) return;

            if (selectedFeature) {
                selectedFeature = unselectFeature(selectedFeature);
            }

            const feature = scene?.pick(movement.endPosition);
            if (feature instanceof Cesium3DTileFeature) {
                selectedFeature = selectFeature(feature);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(() => {
            let elem: IElement | undefined;
            if (selectedFeature) {
                selectedElement = (selectedFeature as Cesium3DTileFeature).getProperty('element');
                elem = { element_id: selectedElement!.toString(), imodel_id: props.imodelId };

                dispatch(UPD_SELECTED_ELEMENT(elem));
                dispatch(DRAWER_STATE({ open: true }));
            } else {
                elem = undefined;
                dispatch(UPD_SELECTED_ELEMENT(elem));
                dispatch(DRAWER_STATE({ open: false }));

                console.log(`Selected element: ${selectedFeature}`);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    }, [scene, picking, selectedFeature, selectedElement]);

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
