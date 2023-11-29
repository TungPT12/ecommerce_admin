import axiosAdminInstance from "../configs/axios/admin";

const signin = async (email, password) => {
    try {
        const response = await axiosAdminInstance.post('/signin', {
            email: email,
            password: password
        });
        return response
    } catch (error) {
        return error.response;
    }
}

const checkAccessToken = async (token) => {
    try {
        const response = await axiosAdminInstance.post('/access-token', {
            token: token,
        });
        return response
    } catch (error) {
        return error.response;
    }
}

export {
    signin,
    checkAccessToken
}