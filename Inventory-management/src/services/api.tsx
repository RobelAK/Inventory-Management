import axios from 'axios';

const API_BASE_URL = 'https://localhost:7183';  // Change port if your API runs on different one (check Swagger URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;