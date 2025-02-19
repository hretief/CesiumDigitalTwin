// #region Imports

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

// #region Cesium imports
import { Viewer as CesiumViewer, Color, Cartesian3, SceneMode, Math, Cartesian2, ScreenSpaceEventType, ScreenSpaceEventHandler as CesiumScreenSpaceEventHandler, Cesium3DTileFeature } from 'cesium';
import { Viewer, Scene, useCesium, CesiumComponentRef, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
// #endregion

// #region React imports
import { useRef, useState, Fragment, useEffect } from 'react';
// #endregion

// #region Redux imports
import { useSelector, useDispatch } from 'react-redux';
// #endregion

// #region Local imports
import BIMModel from './BIMModel';
import { IBIMModel } from '../../classes/interfaces/IBIMModel';
import data from '../../assets/imodels.json';
//import meshdata from '../../assets/4e4ab500-27d3-482b-b40f-12a40d536953.json';
//import { IRealityMesh } from '../../classes/interfaces/IRealityMesh';
import { RootState } from '../../store';
import { IElement } from '../../classes/interfaces/IElement';
import { DRAWER_STATE } from './state/drawerSlice';
import { UPD_SELECTED_ELEMENT } from '../Cesium/BIMModel/state/elementSlice';
import zIndex from '@mui/material/styles/zIndex';
// #endregion

// #endregion

// #region Global variables
const cadmodels: IBIMModel[] = data;
//const meshes: IRealityMesh[] = meshdata.realityData;
type Anchor = 'top' | 'left' | 'bottom' | 'right';
// #endregion

export default function CesiumPage() {
    // #region Local variables
    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [value, setValue] = useState(0);
    const isFirstRender = useRef(true);
    const dispatch = useDispatch();

    const currentSelectedElement: IElement = useSelector((state: RootState) => state.element as IElement);
    const drawerState: boolean = useSelector((state: RootState) => state.drawers.open);
    const defaultAnchor: Anchor = 'right';
    // #endregion

    // #region Event Handlers
    const toggleDrawer = (isopen: boolean) => () => {
        dispatch(DRAWER_STATE({ open: isopen }));
    };

    const list = (anchor: Anchor) => (
        <Box sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                {[`ElementId: ${currentSelectedElement.element_id}`, `iModelId: ${currentSelectedElement.imodel_id}`, 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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
    // #endregion

    // #region Main Code
    useEffect(() => {
        if (isFirstRender.current) {
            dispatch(DRAWER_STATE({ open: false }));
            dispatch(UPD_SELECTED_ELEMENT(undefined));

            if (!currentSelectedElement) {
                toggleDrawer(false);
            }
        }

        isFirstRender.current = false;

        // ---> StrictMode: The following is REQUIRED to reset/cleanup:
        return () => {
            isFirstRender.current = true;
        };
    }, []); // ---> The `[]` is required, it won't work with `[myDependency]` etc.

    // #endregion
    const drawerWidth = '25%'

    // #region Render code
    //sample URL for reality data: https://connect-imodelweb.bentley.com/imodeljs/?projectId=4e4ab500-27d3-482b-b40f-12a40d536953&iModelId=b95148fc-0af8-4aaf-9848-148c4d02eb49
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs aria-label="basic tabs example" onChange={handleChange} value={false}>
                    <Tab label={'Home'} value={{ lat: 0, lng: 0, height: 0 }} />

                    {cadmodels
                        .filter((x) => x !== undefined)
                        .map((model) => (
                            <Tab label={model.name} value={{ lat: model.lat, lng: model.lng, height: model.height }} />
                        ))}
                </Tabs>
            </Box>

            <Grid>
                <Viewer navigationHelpButton={false} selectionIndicator={false} homeButton={false} infoBox={false} timeline={false} ref={refViewer} style={{ position: 'absolute', top: 150, left: 0, right: 0, bottom: 0 }}>
                    <Scene mode={SceneMode.SCENE3D} morphDuration={10}>
                        {cadmodels.map((model) => (
                            <BIMModel imodelId={model.id} position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)} name={model.name} description={model.description}></BIMModel>
                        ))}
                    </Scene>
                </Viewer>
                <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                    <Fragment key={defaultAnchor}>
                        <Drawer
                            sx={{
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '80%', top: '15%',},
                                zIndex: 1,
                            }}
                            anchor={defaultAnchor}
                            open={drawerState}
                            onClose={toggleDrawer(false)}
                        >
                            {list(defaultAnchor)}
                        </Drawer>
                    </Fragment>
                </Box>
                <Box>
                    <BottomNavigation
                        sx={{ position: 'absolute', bottom: 100, right: 500 }}
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
                    </BottomNavigation>
                </Box>
            </Grid>
        </>
    );

    // #endregion
}
