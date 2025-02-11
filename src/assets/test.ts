import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType, useCesium } from 'resium';
import { Cartesian3, HeadingPitchRoll, Color, ColorBlendMode } from 'cesium';
import { useCesium } from 'resium';

const CesiumViewer: React.FC = () => {
    const { scene, viewer } = useCesium();
    const [selectedFeature, setSelectedFeature] = useState<any | undefined>(undefined);
    const [picking, setPicking] = useState(false);
    const nameOverlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const response = await fetch('https://api.cesium.com/itwin/token');
            const { access_token: token } = await response.json();
            Cesium.ITwinPlatform.defaultAccessToken = token;

            // Set up tilesets
            const surroundingArea = await Cesium.ITwinData.createTilesetFromIModelId('f856f57d-3d28-4265-9c4f-5e60c0662c15');
            const station = await Cesium.ITwinData.createTilesetFromIModelId('669dde67-eb69-4e0b-bcf2-f722eee94746');
            surroundingArea.colorBlendMode = ColorBlendMode.REPLACE;
            station.colorBlendMode = ColorBlendMode.REPLACE;

            scene?.primitives.add(surroundingArea);
            scene?.primitives.add(station);

            // Create reality mesh
            const realityMesh = await Cesium.ITwinData.createTilesetForRealityDataId('535a24a3-9b29-4e23-bb5d-9cedb524c743', '85897090-3bcc-470b-bec7-20bb639cc1b9');
            scene?.primitives.add(realityMesh);
        };

        fetchToken();

        // Set up ScreenSpaceEventHandler for feature selection
        const handler = new ScreenSpaceEventHandler(scene?.canvas);
        handler.setInputAction((movement: any) => {
            if (!picking) return;

            if (selectedFeature) {
                unselectFeature(selectedFeature);
            }

            const feature = scene?.pick(movement.endPosition);
            if (feature instanceof Cesium.Cesium3DTileFeature) {
                selectFeature(feature, movement);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    }, [scene, picking, selectedFeature]);

    const selectFeature = (feature: any, movement: any) => {
        feature.color = Color.clone(Color.fromCssColorString('#eeff41'), feature.color);
        setSelectedFeature(feature);

        if (nameOverlayRef.current) {
            nameOverlayRef.current.style.display = 'block';
            nameOverlayRef.current.style.bottom = `${viewer?.canvas.clientHeight - movement.endPosition.y}px`;
            nameOverlayRef.current.style.left = `${movement.endPosition.x}px`;
            const element = feature.getProperty('element');
            const subcategory = feature.getProperty('subcategory');
            const message = `Element ID: ${element}\nSubcategory: ${subcategory}\nFeature ID: ${feature.featureId}`;
            nameOverlayRef.current.textContent = message;
        }
    };

    const unselectFeature = (feature: any) => {
        if (!feature) return;

        feature.color = Color.clone(Color.WHITE, feature.color);
        setSelectedFeature(undefined);

        if (nameOverlayRef.current) {
            nameOverlayRef.current.style.display = 'none';
        }
    };

    const togglePicking = (checked: boolean) => {
        setPicking(checked);
        if (!checked) {
            unselectFeature(selectedFeature);
        }
    };

    const birdsEyeView = {
        destination: new Cartesian3(1255923.367096007, -4734564.543879414, 4072623.4624344883),
        orientation: new HeadingPitchRoll(6.283185307179586, -0.5002442676148875, 6.283185307179586),
        duration: 0,
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    };

    const stationView = {
        destination: new Cartesian3(1255783.605894154, -4732864.394472763, 4073433.975291202),
        orientation: new HeadingPitchRoll(5.646321670432638, -0.4736439399770642, 0.00001691713303575426),
        duration: 0,
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
    };

    const photoSphereModeEnabled = useRef(false);

    const togglePhotosphere = (forceMode?: boolean) => {
        const shouldBeEnabled = forceMode ?? !photoSphereModeEnabled.current;
        if (shouldBeEnabled) {
            scene?.screenSpaceCameraController.setOptions({
                enableRotate: false,
                enableZoom: false,
                enableTranslate: false,
                enableTilt: false,
                lookEventTypes: {
                    eventType: Cesium.CameraEventType.LEFT_DRAG,
                },
            });
            photoSphereModeEnabled.current = true;
        } else {
            scene?.screenSpaceCameraController.setOptions({
                enableRotate: true,
                enableZoom: true,
                enableTranslate: true,
                enableTilt: true,
                lookEventTypes: {
                    eventType: Cesium.CameraEventType.LEFT_DRAG,
                    modifier: Cesium.KeyboardEventModifier.SHIFT,
                },
            });
            photoSphereModeEnabled.current = false;
        }
    };

    return (
        <>
            <Viewer full terrainProvider={Cesium.createWorldTerrain()} animation={false} sceneModePicker={false} geocoder={false} homeButton={false}>
                <div
                    className="backdrop"
                    ref={nameOverlayRef}
                    style={{ display: 'none', position: 'absolute', bottom: '0', left: '0', pointerEvents: 'none', padding: '4px', backgroundColor: 'black', whiteSpace: 'pre-line', fontSize: '12px' }}
                />
            </Viewer>

            <button onClick={() => togglePicking(!picking)}>Feature selection on hover</button>

            <button onClick={() => viewer?.scene.camera.flyTo(birdsEyeView)}>Birdseye view</button>

            <button onClick={() => viewer?.scene.camera.flyTo(stationView)}>Focus station</button>

            <button onClick={() => togglePhotosphere(true)}>Enable Photosphere</button>
            <button onClick={() => togglePhotosphere(false)}>Disable Photosphere</button>
        </>
    );
};

export default CesiumViewer;
