import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IModelBoundingSphere } from '../../../../classes/interfaces';

const initialState: IModelBoundingSphere[] = [];

const viewerSlice = createSlice({
    name: 'viewer',
    initialState,
    reducers: {
        APPEND_BOUNDING_SPHERE: (state, action: PayloadAction<IModelBoundingSphere>) => {
            //append the object to the array
            state.push(action.payload);
        },
    },
});

export const { APPEND_BOUNDING_SPHERE } = viewerSlice.actions;

export default viewerSlice.reducer;
