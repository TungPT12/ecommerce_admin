import axios from 'axios';

const uploadImagesApi = async (formData) => {
    try {
        const response = axios.post('http://localhost:5000/api/upload-images', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response;
    } catch (error) {
        return error.response
    }
}

const uploadAnImagesApi = async (formData) => {
    try {
        const response = axios.post('http://localhost:5000/api/upload-image', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response;
    } catch (error) {
        return error.response
    }
}

export {
    uploadImagesApi,
    uploadAnImagesApi
};