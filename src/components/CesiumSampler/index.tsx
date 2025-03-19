import { createGooglePhotorealistic3DTileset, Ion, IonGeocodeProviderType, Scene as CesiumScene } from 'cesium';
import { Viewer, Scene, CesiumComponentRef, createCesiumComponent, useCesium } from 'resium';
import { useEffect, useState } from 'react';

import { ION_TOKEN } from '../../utils/constants';

export default function CesiumSamplerPage() {
    Ion.defaultAccessToken = ION_TOKEN || '';
    const { viewer } = useCesium();


    const CesiumComponent = createCesiumComponent({
        name: 'googlePhotoTile',
        
        create(context) {
            createGooglePhotorealistic3DTileset({onlyUsingWithGoogleGeocoder: true}).then((tileset) => {
                context.scene?.primitives.add(tileset);
            });
        },
    });

    return (
        <>
            <Viewer className="w-full h-[1000px]" geocoder={IonGeocodeProviderType.GOOGLE}>
                <CesiumComponent />
            </Viewer>
        </>
    );
}
