import axios from 'axios';
const API_BASE_URL = 'http://localhost'
const API_PORT = 8000

const api = axios.create({
  baseURL: `${API_BASE_URL}:${API_PORT}`
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // console.log("request error", error);
    return Promise.reject(error);
  }
);

export default api
