import axios from 'axios';
const API_BASE_URL = 'http://localhost'
const API_PORT = 8000
export default axios.create({
  baseURL: `${API_BASE_URL}:${API_PORT}`
});
