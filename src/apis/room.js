import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";
const getAllRoomAdminApi = async (token, page) => {
    try {
        const response = await axiosAdminInstance.get(`/rooms?page=${page}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const createRoomAdminApi = async (token, room) => {
    try {
        const response = await axiosAdminInstance.post('/room', room, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteRoomByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.delete(`/room/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getRoomByIdAdminApi = async (token, id) => {
    try {
        const response = await axiosAdminInstance.get(`/room/${id}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const updateRoomByIdAdminApi = async (token, room) => {
    try {
        const response = await axiosAdminInstance.put(`/room`, room, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    getAllRoomAdminApi,
    createRoomAdminApi,
    deleteRoomByIdAdminApi,
    updateRoomByIdAdminApi,
    getRoomByIdAdminApi
}