import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL || "https://www-tunestream.onrender.com";
if (baseUrl.includes("tunestream-backend.vercel.app")) {
  baseUrl = "https://www-tunestream.onrender.com";
}
export const url = baseUrl;

const API = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});



// Token refresh handling
let isRefreshing = false;

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (originalRequest?.url.includes("/user/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        await API.get("/user/refresh");
        isRefreshing = false;

        return API(originalRequest); // retry original request
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;