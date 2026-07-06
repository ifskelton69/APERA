import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://apera.onrender.com/api"
      : "https://apera.onrender.com/api",
  withCredentials: true,
});