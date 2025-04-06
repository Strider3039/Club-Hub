import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const authAxios = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

authAxios.interceptors.request.use(
    async (config) => {
        const access = localStorage.getItem("access");
        config.headers.Authorization = access ? `Bearer ${access}` : "";
        return config;
    },
    (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.code === "token_not_valid" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");
            try {
                const res = await axios.post(`${baseURL}/api/token/refresh/`, {
                    refresh: refresh,
                });

                localStorage.setItem("access", res.data.access);
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

                return authAxios(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.clear();
                window.location.href = "/login"; // Force logout
            }
        }

        return Promise.reject(error);
    }
);

export default authAxios;
