import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { WritableDraft } from 'immer';
import { IElement } from '../../../../classes/interfaces';

const initialState: IElement = {
    element_id: '',
    imodel_id: '',
};

const courseSlice = createSlice({
    name: 'element',
    initialState,
    reducers: {
        UPD_SELECTED_ELEMENT: (state, action: PayloadAction<IElement | undefined>) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { UPD_SELECTED_ELEMENT } = courseSlice.actions;

export default courseSlice.reducer;
