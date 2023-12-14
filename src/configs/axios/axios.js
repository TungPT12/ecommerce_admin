import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    // baseURL: 'https://tungstore.onrender.com/api/',
    withCredentials: true
});

export default axiosInstance;