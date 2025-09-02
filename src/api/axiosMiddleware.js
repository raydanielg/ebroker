import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import Router from "next/router";
import Swal from "sweetalert2";
const access_key_param = "x-access-key";
const access_key = "903361";

const url = process.env.NEXT_PUBLIC_API_URL;
const subUrl = process.env.NEXT_PUBLIC_END_POINT;
const api = axios.create({
  baseURL: `${url}${subUrl}`,
});

const getStoredToken = async () => {
  const state = store.getState();
  return state?.User?.jwtToken;
};

const getStoredLocaleCode = async () => {
  const state = store.getState();
  return state?.LanguageSettings?.current_language?.code;
};

const getStoredLocaleFile = async () => {
  const state = store.getState();
  return state?.LanguageSettings?.current_language?.file;
};

api.interceptors.request.use(
  async (config) => {
    try {
      const authToken = await getStoredToken();
      const localeCode = await getStoredLocaleCode();
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      if (localeCode) {
        config.headers["Content-Language"] = localeCode;
      }
      config.headers["Content-Type"] = "multipart/form-data";
      // config.headers["x-access-key"] = access_key
      return config;
    } catch (error) {
      console.error("Error in token retrival", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Error in inceptor", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    try {
      return response;
    } catch (error) {
      console.error("Error while fetching data", error);
      return Promise.reject(error);
    }
  },
  async (error) => {
    console.error("Error while fetching data", error);
    if (error?.response?.status === 401 && error?.response?.data?.key === "accountDeactivated") {
      const fileName = await getStoredLocaleFile();
      Swal.fire({
        title: fileName["opps"],
        text: fileName["accountDeactivatedByAdmin"],
        icon: "warning",
        showCancelButton: false,
        customClass: {
          confirmButton: "Swal-confirm-buttons",
          cancelButton: "Swal-cancel-buttons",
        },
        confirmButtonText: fileName["ok"],
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch(logout());
          Router.push(`/`);
        }
      });
    }
    if (error?.response?.status === 401) {
      console.error("Unauthorized access - Logging out user");
      store.dispatch(logout());
      Router.push("/");
      // Optionally, you can redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error?.response?.data);
  },
);

export default api;
