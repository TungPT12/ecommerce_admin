import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";
const getUsersAdminApi = async (token) => {
    try {
        const response = await axiosAdminInstance.get('/users', setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}
// const getUsersAdminApi = async (token, { page }) => {
//     try {
//         const router = '/users?page=' + (page ? page : 1);
//         const response = await axiosAdminInstance.get(router, setHeaders(token));
//         return response;
//     } catch (error) {
//         return error.response;
//     }
// }

const createUserAdminApi = async (token, user) => {
    try {
        const response = await axiosAdminInstance.post('user', user, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const disableUserAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.put(`/user/disable/${id}`, {}, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}
const enableUserAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.put(`/user/enable/${id}`, {}, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}


const getUserCountAdminApi = async (token) => {
    try {
        const response = await axiosAdminInstance.get(`/users/count`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    getUsersAdminApi,
    disableUserAdminApi,
    enableUserAdminApi,
    createUserAdminApi,
    getUserCountAdminApi
}