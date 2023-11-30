import axios from 'axios';
const axiosAdminInstance = axios.create({
    baseURL: 'http://localhost:5000/api/admin',
    withCredentials: true
});

export default axiosAdminInstance;