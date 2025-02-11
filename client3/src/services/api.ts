import { BASE_API_URL } from "../lib/constants";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api
