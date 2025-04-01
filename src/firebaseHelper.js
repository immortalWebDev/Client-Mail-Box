import axios from "axios";

// Function to get a fresh token using the refresh token
export const getFreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_NEW_JWT_TOKEN}${
        import.meta.env.VITE_FIREBASE_API
      }`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );
    console.log(response.data);
    const newIdToken = response.data.id_token;
    const newRefreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in;
    //   console.log(expiresIn)

    // console.log(response.data); //email doesnt come with this

    //   console.log("Fetched new token from Firebase bcz old token expired");
    // Update tokens in localStorage
    localStorage.setItem("idToken", newIdToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("tokenExpiry", Date.now() + expiresIn * 1000);
    console.log("Fresh token set");

    //   window.location.reload(); //For new token to take effect for profile fetch

    return newIdToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh token");
  }
};

// Function for gettin valid token
export const getToken = async () => {
  const token = localStorage.getItem("idToken");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  // Check token valiidity
  if (token && Date.now() < tokenExpiry) {
    // console.log("old token retained")
    return token;
  } else {
    // console.log("Getting new token...");
    return await getFreshToken();
  }
};
