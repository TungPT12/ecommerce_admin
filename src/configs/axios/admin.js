import axios from 'axios';
const axiosAdminInstance = axios.create({
    // baseURL: 'http://localhost:5000/api/admin',
    baseURL: 'https://booking-server-gafr.onrender.com/api/admin',
    // headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('bookingAdminToken') ? localStorage.getItem('bookingAdminToken') : ""}`
    // }
});

export default axiosAdminInstance;