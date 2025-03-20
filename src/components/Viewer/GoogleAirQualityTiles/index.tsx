//Cesium imports
import { SingleTileImageryProvider, ImageryLayer, Rectangle as CesiumRectangle } from 'cesium';
import { Cesium3DTileset, useCesium } from 'resium';

//React imports
import { useEffect } from 'react';

//Redux imports

//Local imports
import {} from '../../Theme/state/themeSlice';
import { GOOGLE_AIRQUALITY_TILES_URI, GOOGLE_MAPS_KEY } from '../../../utils/constants';

export default function GoogleAirQualityTiles() {
    const { viewer } = useCesium();

    useEffect(() => {
        const fetchGoogleTiles = async () => {
            try {
                // Add heatmap layer (example using a static image)
                const zcoord: number = 2;
                const xcoord: number = 0;
                const ycoord: number = 1;
                const url: string = `${GOOGLE_AIRQUALITY_TILES_URI}/${zcoord}/${xcoord}/${ycoord}?key=${GOOGLE_MAPS_KEY}`;
                let singleTileProvider: SingleTileImageryProvider = await SingleTileImageryProvider.fromUrl(url, { rectangle: CesiumRectangle.fromDegrees(-180.0, 4.0, -90, 72.75) });
                let heatMapLayer: ImageryLayer = new ImageryLayer(singleTileProvider);

                viewer?.imageryLayers.add(heatMapLayer);

            } catch (e) {
                alert(`Error reported while processing Google AQI Component: ${e}`);
            }
        };
        fetchGoogleTiles();
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
        </>
    );
}
