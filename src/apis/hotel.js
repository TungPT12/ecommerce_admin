import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";

const getAllHotelAdminApi = async (token, page) => {
    try {
        const response = await axiosAdminInstance.get(`/hotels?page=${page}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}
// const getAllHotelAdminApi = async (token, { isDisable, page }) => {
//     try {
//         const router = '/hotels?isDisable=' + (isDisable !== undefined && isDisable !== null ? isDisable : '') +
//             '&page=' + (page ? page : 1);
//         const response = await axiosAdminInstance.get(router, setHeaders(token));
//         return response;
//     } catch (error) {
//         return error.response;
//     }
// }

const createHotelAdminApi = async (token, hotel) => {
    try {
        const response = await axiosAdminInstance.post('/hotel', hotel, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const disableHotelAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.delete(`/hotel/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getHotelByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.get(`/hotel/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const updateHotelByIdAdminApi = async (token, hotel) => {
    try {
        const response = await axiosAdminInstance.put(`/hotel`, hotel, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteHotelByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.delete(`/hotel/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    getAllHotelAdminApi,
    createHotelAdminApi,
    disableHotelAdminApi,
    getHotelByIdAdminApi,
    updateHotelByIdAdminApi,
    deleteHotelByIdAdminApi,
}