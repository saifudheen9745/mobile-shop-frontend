import { IAuthState } from "@/app/types/auth.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceState {
  user: IAuthState | null;
  isLoggedIn: boolean;
}

const initialState: AuthSliceState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthState>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
