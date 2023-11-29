import axiosAdminInstance from "../configs/axios/admin";
import setHeaders from "../utils/setHeaders";
const getAllTransactionAdminApi = async (token, page) => {
    try {
        const response = await axiosAdminInstance.get(`/transactions?page=${page}`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getFirstEightTransactionAdminApi = async (token) => {
    try {
        const response = await axiosAdminInstance.get(`/transactions/new`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getTransactionCount = async (token) => {
    try {
        const response = await axiosAdminInstance.get(`/transactions/count`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}

const getBalanceAdminApi = async (token) => {
    try {
        const response = await axiosAdminInstance.get(`/transactions/balance`, setHeaders(token));
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    getAllTransactionAdminApi,
    getFirstEightTransactionAdminApi,
    getTransactionCount,
    getBalanceAdminApi,
}