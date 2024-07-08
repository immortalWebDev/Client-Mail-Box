import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  idToken: localStorage.getItem("idToken"),
  email: localStorage.getItem("email"),
  apiKey: "AIzaSyBtiN7vadJTitonU3zCdeZ1hv2HuGIZ-ts",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      const { idToken, email } = action.payload;
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthenticated", true);
      state.isAuthenticated = true;
      state.idToken = idToken;
      state.email = email;
    },
    logout: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("email");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
      state.idToken = "";
      state.email = "";
    },
  },
});

export const { signUp, login, logout} =
  authSlice.actions;
export default authSlice.reducer;
