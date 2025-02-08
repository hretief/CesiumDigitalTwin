import { createSlice } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";

const initialState = { sidebarVisibility: false };

export const layoutSlice = createSlice({
   name: "layout",
   initialState,
   // The `reducers` field lets us define reducers and generate associated actions
   reducers: {
      toggleSidebarVisibility: (state) => {
         // Redux Toolkit allows us to write "mutating" logic in reducers. It
         // doesn't actually mutate the state because it uses the Immer library,
         // which detects changes to a "draft state" and produces a brand new
         // immutable state based off those changes

         state.sidebarVisibility = !state.sidebarVisibility;

         console.log("in toggleSidebarVisibility slice: " + state.sidebarVisibility);
      },
   },
});

export const { toggleSidebarVisibility } = layoutSlice.actions;
export const selectSidebarVisibility = (state: RootState) => state.layout.sidebarVisibility;

export default layoutSlice.reducer;
