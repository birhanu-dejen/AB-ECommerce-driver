import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
const instance = axios.create({
  baseURL:  apiUrl,
});

export default instance;
