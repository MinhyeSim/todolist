import axios from "axios";

const api = axios.create({
 baseURL: "https://assignment-todolist-api.vercel.app/api",
});

api.interceptors.request.use((config) => {
  return config;
});

export default api;
