import axios, { AxiosHeaders } from "axios";
import { clearStoredToken, getStoredToken } from "../utils/authStorage";

const API_BASE_URL = process.env.REACT_APP_API_URL ?? "http://localhost:5000/api";

export const httpClient = axios.create({ baseURL: API_BASE_URL });

httpClient.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) {
    config.headers = AxiosHeaders.from(config.headers || {});
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    if (status === 401) {
      clearStoredToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);
