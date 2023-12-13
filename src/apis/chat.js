import axiosInstance from "../configs/axios/axios";

const sendMessageApi = async (message, roomId, userId) => {
    try {
        const response = await axiosInstance.post('/sendMessage', {
            message: message,
            roomId: roomId,
            isClient: false,
        });
        return response
    } catch (error) {
        return error.response;
    }
}

const getRoomsChatApi = async () => {
    try {
        const response = await axiosInstance.get('/getRoomsChat');
        return response
    } catch (error) {
        return error.response;
    }
}

const getRoomChatApi = async (roomId) => {
    try {
        const response = await axiosInstance.get(`/room/${roomId}`);
        return response
    } catch (error) {
        return error.response;
    }
}

const destroyRoomChatApi = async (roomId) => {
    try {
        const response = await axiosInstance.delete(`/room-chat/${roomId}`);
        return response
    } catch (error) {
        return error.response;
    }
}


export {
    sendMessageApi,
    getRoomsChatApi,
    getRoomChatApi,
    destroyRoomChatApi,
}