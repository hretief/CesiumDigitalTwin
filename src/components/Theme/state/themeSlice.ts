import { createSlice } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../../store";

const initialState = { darkMode: false };

export const themeSlice = createSlice({
   name: "theme",
   initialState,
   // The `reducers` field lets us define reducers and generate associated actions
   reducers: {
      toggleState: (state) => {
         // Redux Toolkit allows us to write "mutating" logic in reducers. It
         // doesn't actually mutate the state because it uses the Immer library,
         // which detects changes to a "draft state" and produces a brand new
         // immutable state based off those changes

         state.darkMode = !state.darkMode;

         console.log("in toggleState: " + state.darkMode);
      },
   },
});

export const { toggleState } = themeSlice.actions;
export const selectThemeDarkMode = (state: RootState) => state.theme.darkMode;

export default themeSlice.reducer;
