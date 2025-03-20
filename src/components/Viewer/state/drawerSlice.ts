// Redux imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Local imports
import { IDrawerState } from '../../../classes/interfaces';

const initialState: IDrawerState = {
    open: true,
};

const courseSlice = createSlice({
    name: 'drawerstate',
    initialState,
    reducers: {
        DRAWER_STATE: (state, action: PayloadAction<IDrawerState>) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { DRAWER_STATE } = courseSlice.actions;

export default courseSlice.reducer;
