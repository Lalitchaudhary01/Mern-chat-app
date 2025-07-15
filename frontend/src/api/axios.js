// client/src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // important if using cookies/auth
});

export default instance;
