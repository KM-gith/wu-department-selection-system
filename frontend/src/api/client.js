import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("wu_dss_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
