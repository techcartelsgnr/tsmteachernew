import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";
import { logout } from "../slices/authSlice";

const apiClient = axios.create({
  baseURL: "https://theschoolmate.in/api/",
  headers: {
    Accept: "application/json",
  },
});

/* =====================================================
   REQUEST INTERCEPTOR (ATTACH TOKEN)
===================================================== */

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = await AsyncStorage.getItem("teacher_info");

      if (user) {
        const parsed = JSON.parse(user);

        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }

      return config;
    } catch (error) {
      console.log("Token read error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   RESPONSE INTERCEPTOR (AUTO LOGOUT ON 401)
===================================================== */

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {

    const status = error?.response?.status;
    const url = error?.config?.url;

    /* IGNORE LOGIN API */

    if (status === 401 && !url.includes("teacher/login")) {

      console.log("Session expired → logging out");

      await AsyncStorage.removeItem("teacher_info");
      await AsyncStorage.removeItem("user_type");

      store.dispatch(logout());

    }

    return Promise.reject(error);

  }
);

export default apiClient;