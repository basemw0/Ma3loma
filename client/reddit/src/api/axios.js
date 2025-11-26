import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173/", // Put your backend URL
  withCredentials: true,            // important if backend uses cookies
});

export default api;
