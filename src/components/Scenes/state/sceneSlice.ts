import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBIMModel } from '../../../classes/interfaces';

const initialState: IBIMModel[] = [];

const sceneSlice = createSlice({
    name: 'scene',
    initialState,
    reducers: {
        APPEND_ITWINS_SCENE: (state, action: PayloadAction<IBIMModel[]>) => {
            // append to the array
            state.push(...action.payload);
        },

        REPLACE_ITWINS_SCENE: (state, action: PayloadAction<IBIMModel[]>) => {
            // replace the array
            return action.payload;
        },

        EMPTY_ITWINS_SCENE: (state) => {
            // empty the array
            state.length = 0;
        },
    },
});

export const { APPEND_ITWINS_SCENE, REPLACE_ITWINS_SCENE, EMPTY_ITWINS_SCENE } = sceneSlice.actions;

export default sceneSlice.reducer;
