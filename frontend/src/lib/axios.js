import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'https://apera.onrender.com/api' : '/api',
  withCredentials: true,// to send cookies with requests
});