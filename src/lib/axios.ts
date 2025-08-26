import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Centralized error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      const message = error.response.data?.message || 'Server error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // No response received
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'Unknown error'));
    }
  }
);

export default axiosInstance; 