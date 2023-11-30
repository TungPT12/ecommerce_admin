import { uploadImagesApi, uploadAnImagesApi } from "../apis/uploadImage";

const uploadImages = async (images) => {
    try {
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        const response = await uploadImagesApi(formData);
        if (response.status !== 200) {
            throw new Error('loi')
        }
        return response.data;
    } catch (error) {
        console.log(error)
        return null
    }
}

const uploadAnImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        const response = await uploadAnImagesApi(formData);
        if (response.status !== 200) {
            throw new Error('loi')
        }
        return response.data;
    } catch (error) {
        console.log(error)
        return null
    }
}

export {
    uploadImages,
    uploadAnImage
};