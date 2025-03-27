import axios from "axios";

const axiosClient = axios.create({
    //how i import the .env VITE_API_BASE_URL
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,

});


// Request interceptor: Adds the token to the request headers
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor: Handles error responses (e.g., 401 Unauthorized)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response && response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN');
                // Optionally, redirect to login page or trigger other actions
            }
        } catch (e) {
            console.error('Error handling response:', e);
        }
        
        // Always return a rejected promise with the error
        return Promise.reject(error);
    }
);

export default axiosClient;
