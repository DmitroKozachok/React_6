import axios from "axios";
import {BASE_URL} from "./apiConfig";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// const token = localStorage.getItem('jwt');
// axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;