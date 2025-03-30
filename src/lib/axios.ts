import axios from "axios";

const api = axios.create({
 baseURL: "https://assignment-todolist-api.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log("📡 요청 URL:", config.baseURL + config.url);
  console.log("📦 보낼 데이터:", config.data);
  return config;
});


export default api;
