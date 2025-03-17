import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

export interface IAuthentication {
   isProcessingRequest: boolean;
   accessToken?: string;
}

const initialState: IAuthentication = { isProcessingRequest: false };

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
//
export const authenticationSlice = createSlice({
   name: "authentication",
   initialState,
   // The `reducers` field lets us define reducers and generate associated actions
   reducers: {
      start: (state) => {
         return {
            ...state,
            isProcessingRequest: true,
         };
      },
      success: (state) => {
         return {
            ...state,
            isProcessingRequest: false,
         };
      },

      error: (state) => {
         return {
            ...state,
            isProcessingRequest: false,
         };
      },
   },
});

/*
export const authenticateUser = (userData: any) => async (dispatch: any) => {
   try {
      const authData = await authenticate(userData);
      setTokens(authData.data);
      dispatch(success(authData.data));
      history.push("/v1");
   } catch (err) {
      dispatch(error(err));
   }
};
*/
export const { start, success, error } = authenticationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAuthentication = (state: RootState) => state.authentication;
export const authenticationReducer = authenticationSlice.reducer;
