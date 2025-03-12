import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
//import counterReducer from "./components/counter/counterSlice";
//import segmentReducer from "./components/segments/state/segmentSlice";
//import projectReducer from "./components/projects/state/projectSlice";
//import facilityReducer from "./components/Facilities/state/facilitiesSlice";
//import userReducer from "./components/Users/state/usersSlice";
import themeReducer from './components/Theme/state/themeSlice';
import layoutReducer from './state/layoutSlice';
import { authenticationReducer } from './components/Authentication/state/authenticationSlice';
import bimmodelReducer from './components/Cesium/BIMModel/state/elementSlice';
import drawerReducer from './components/Cesium/state/drawerSlice';
import viewerReducer from './components/Cesium/BIMModel/state/viewerSlice';

export const store = configureStore({
    reducer: {
        element: bimmodelReducer,
        drawers: drawerReducer,
        //segments: segmentReducer,
        //projects: projectReducer,
        theme: themeReducer,
        layout: layoutReducer,
        //facilities: facilityReducer,
        //users: userReducer,
        viewerRed: viewerReducer,
        authentication: authenticationReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
