import axiosInstance from "../configs/axios/axios";

const sendMessageApi = async (message, roomId, userId) => {
    try {
        const response = await axiosInstance.post('/sendMessage', {
            message: message,
            roomId: roomId,
            userId: userId,
        });
        return response
    } catch (error) {
        return error.response;
    }
}


export {
    sendMessageApi,
}