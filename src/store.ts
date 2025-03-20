import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';

import themeReducer from './components/Theme/state/themeSlice';
import layoutReducer from './state/layoutSlice';
import { authenticationReducer } from './components/Authentication/state/authenticationSlice';
import bimmodelReducer from './components/Viewer/BIMModel/state/elementSlice';
import drawerReducer from './components/Viewer/state/drawerSlice';
import viewerReducer from './components/Viewer/BIMModel/state/viewerSlice';
import sceneReducer from './components/Scenes/state/sceneSlice';

export const store = configureStore({
    reducer: {
        element: bimmodelReducer,
        drawers: drawerReducer,
        theme: themeReducer,
        layout: layoutReducer,
        scene: sceneReducer,
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
