import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";


const getTypesAdminApi = async (token, page) => {
    try {
        const response = await axiosAdminInstance.get(`/types?page=${page}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getTypeByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.get(`type/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const createTypeAdminApi = async (token, type) => {
    try {
        const response = await axiosAdminInstance.post('/type', type, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteTypeAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.delete(`/type/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const updateTypeByIdAdminApi = async (token, type) => {
    try {
        const response = await axiosAdminInstance.put(`/type`, type, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}



export {
    getTypesAdminApi,
    createTypeAdminApi,
    deleteTypeAdminApi,
    getTypeByIdAdminApi,
    updateTypeByIdAdminApi,
}