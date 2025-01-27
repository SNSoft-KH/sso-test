// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // NestJS backend URL
  withCredentials: true, // Allow sending cookies (JWT)
});

export default axiosInstance;
