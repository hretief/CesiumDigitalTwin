import { createGooglePhotorealistic3DTileset, Ion, IonGeocodeProviderType, Cartesian3, HeadingPitchRoll } from 'cesium';
import { Viewer, createCesiumComponent, useCesium, Camera, CameraFlyTo, Globe } from 'resium';
import { useEffect, useState } from 'react';

import { ION_TOKEN } from '../../utils/constants';

export default function CesiumSamplerPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    const { viewer } = useCesium();

    let dest:Cartesian3 = new Cartesian3(-2693797.551060477, -4297135.517094725, 3854700.7470414364);
    let orient:HeadingPitchRoll = new HeadingPitchRoll(4.6550106925119925, -0.2863894863138836, 1.3561760425773173e-7);

    const CesiumComponent = createCesiumComponent({
        name: 'googlePhotoTile',

        create(context) {
            createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true }).then((tileset) => {
                context.scene?.primitives.add(tileset);
            });
        },
    });
    if (viewer?.scene?.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true;
    }

    return (
        <>
            <Viewer geocoder={IonGeocodeProviderType.GOOGLE} timeline={false} animation={false} sceneModePicker={false} baseLayerPicker={false}>
                <CesiumComponent />
                <Globe show={false} />
                <CameraFlyTo orientation={orient} destination={dest} />
            </Viewer>
        </>
    );
}
