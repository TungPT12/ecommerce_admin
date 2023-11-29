import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";

const getAreasAdminApi = async (token, page) => {
    try {
        const response = await axiosAdminInstance.get(`areas?page=${page}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}
const getAreaByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.get(`area/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const createAreaAdminApi = async (token, area) => {
    try {
        const response = await axiosAdminInstance.post('/area', area, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const updateAreaByIdAdminApi = async (token, area, id) => {
    try {
        const response = await axiosAdminInstance.put(`/area/${id}`, area, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteAreaAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.delete(`/area/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

export {
    getAreasAdminApi,
    createAreaAdminApi,
    getAreaByIdAdminApi,
    updateAreaByIdAdminApi,
    deleteAreaAdminApi
}