import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated"),
  idToken: localStorage.getItem("idToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  email: localStorage.getItem("email"),
  tokenExpiry: localStorage.getItem("tokenExpiry"),
  apiKey: import.meta.env.VITE_FIREBASE_API,
  isLoading: false,
  notification: {
    message: null,
    variant: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      const { idToken, email , refreshToken, expiresIn  } = action.payload;
      const tokenExpiry = Date.now() + expiresIn * 1000;
      localStorage.setItem("tokenExpiry",tokenExpiry)
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthenticated", true);
      localStorage.removeItem("manualLogout")


      state.isAuthenticated = true;
      state.idToken = idToken;
      // console.log(state.idToken)
      
      state.email = email;
      state.refreshToken = refreshToken;
      state.tokenExpiry = tokenExpiry;
      // console.log(state.tokenExpiry)
    },
    logout: (state) => {
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("tokenExpiry");

      state.isAuthenticated = false;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.idToken = "";
      state.email = "";
    },
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        variant: action.payload.variant,
      };
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { signUp, login, logout, showNotification, setIsLoading } =
  authSlice.actions;
export default authSlice.reducer;
