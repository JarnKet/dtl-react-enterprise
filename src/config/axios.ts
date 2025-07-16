import {AUTH_KEY} from "@/constants";
import axios from "axios";


// Create an Axios instance
const axiosInstance = axios.create({
    // baseURL: API,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem(AUTH_KEY);

        if (authData) {
            const parsedAuthData = JSON.parse(authData);
            const accessToken = parsedAuthData.accessToken;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error, "Instance Error");

        if (
            error.response.data.message === "UNAUTHORIZED" ||
            error.response.data.message === "TOKEN_EXPIRED"
        ) {
            localStorage.clear();
            window.location.href = "/";
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;