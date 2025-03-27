//Cesium imports
import { ScreenSpaceEventType, Cesium3DTileFeature, Color, Cartesian3, ScreenSpaceEventHandler as CesiumScreenSpaceEventHandler, Cartographic, Matrix4 } from 'cesium';
import { Cesium3DTileset, useCesium } from 'resium';

//React imports
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

//Redux imports
import { useDispatch } from 'react-redux';

//Local imports
import { IElement, IModelBoundingSphere } from '../../../classes/interfaces';
import { UPD_SELECTED_ELEMENT } from './state/elementSlice';
import {} from '../../Theme/state/themeSlice';
import { DRAWER_STATE } from '../state/drawerSlice';
import { APPEND_BOUNDING_SPHERE } from './state/viewerSlice';

interface IModelProps {
    imodelId: string;
    position?: Cartesian3;
    name?: string;
    description?: string;
    heightcorrection: number;
    tilesUrl?: string;
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

    var selectedFeature: any | undefined;
    var selectedElement: string | undefined;
    var token: string | undefined;

    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }

    useEffect(() => {
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
                // debug code
                const propertyIds = selectedFeature.getPropertyIds();
                const length = propertyIds.length;
                for (let i = 0; i < length; ++i) {
                    const propertyId = propertyIds[i];
                    //console.log(`{propertyId}: ${selectedFeature.getProperty(propertyId)}`);
                }
                // end debug code
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
                url={props.tilesUrl as string}
                onReady={(mytiles) => {
                    const cartographic = Cartographic.fromCartesian(mytiles!.boundingSphere.center);
                    const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                    const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, props.heightcorrection); //this is where we adjust the height of the model
                    const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
                    mytiles!.modelMatrix = Matrix4.fromTranslation(translation);

                    dispatch(APPEND_BOUNDING_SPHERE({ imodelId: props.imodelId, boundingSphere: mytiles!.boundingSphere }));
                }}
            ></Cesium3DTileset>
        </>
    );
}
