import { Viewer as CesiumViewer, Cartesian3, SceneMode, Math } from 'cesium';
import { Viewer, Scene, CesiumComponentRef, useCesium } from 'resium';
import { useRef } from 'react';
import BIMModel from './BIMModel';
import { IBIMModel } from '../../classes/interfaces/IBIMModel';
import data from '../../assets/imodels.json';
import { Box, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';

const cadmodels: IBIMModel[] = data;
export default function CesiumPage() {
    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);

    /*
    const { viewer } = useCesium();
    viewer!.camera.flyTo({
        destination: Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
    });
    */
    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        if (newValue.lat !== 0) {
            refViewer.current?.cesiumElement?.camera.flyTo({
                destination: Cartesian3.fromDegrees(newValue.lng, newValue.lat, newValue.height),
                orientation: {
                    heading: Math.toRadians(20.0),
                    pitch: Math.toRadians(-75.0),
                    roll: 0.0,
                },
            });
        } else {
            refViewer.current?.cesiumElement?.camera.flyHome(1);
        }
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs aria-label="basic tabs example" onChange={handleChange}>
                    <Tab label={'Home'} value={{ lat: 0, lng: 0, height: 0 }} />
                    {cadmodels.map((model) => (
                        <Tab label={model.name} value={{ lat: model.lat, lng: model.lng, height: model.height }} />
                    ))}
                </Tabs>
            </Box>

            <Grid>
                <Viewer ref={refViewer} style={{ position: 'absolute', top: 150, left: 0, right: 0, bottom: 0 }}>
                    <Scene mode={SceneMode.SCENE3D} morphDuration={10}>
                        {cadmodels.map((model) => (
                            <BIMModel imodelId={model.id} position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)} name={model.name} description={model.description}></BIMModel>
                        ))}
                    </Scene>
                </Viewer>
            </Grid>
        </>
    );
}
