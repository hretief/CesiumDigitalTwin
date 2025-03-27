//Cesium imports
import { Cartographic, Cartesian3, Matrix4 } from 'cesium';
import { Entity, Cesium3DTileset } from 'resium';
import { useState } from 'react';
import CircularProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

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
    const [progress, setProgress] = useState(0); // State to track loading progress
    const [loading, setLoading] = useState(true); // State to track loading status

    return (
        <>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                    }}
                >
                    <CircularProgress variant="determinate" value={progress} />
                </Box>
            )}

            <Cesium3DTileset
                url={props.tilesUrl as string}
                onReady={(tileset) => {
                    const cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center);
                    const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
                    const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, props.heightcorrection); //this is where we adjust the height of the model
                    const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
                    tileset.modelMatrix = Matrix4.fromTranslation(translation);

                    setLoading(false);
                }}
                onLoadProgress={(numberOfPendingRequests, numberOfTilesProcessing) => {
                    const totalTiles = numberOfPendingRequests + numberOfTilesProcessing;

                    if (totalTiles === 0) {
                        setProgress(100); // Set progress to 100% when loading is complete
                        setLoading(false); // Hide the progress bar
                    } else {
                        const loadedTiles = Math.max(0, 100 - totalTiles); // Simulate progress
                        setProgress((loadedTiles / 100) * 100); // Calculate percentage
                    }
                }}
            ></Cesium3DTileset>
            <Entity point={{ pixelSize: 20 }} name={props.displayName} />
        </>
    );
}
