import { uploadImagesApi, uploadAnImagesApi } from "../apis/uploadImage";

const uploadImages = async (images) => {
    try {
        console.log(images.length)
        const formData = new FormData();
        for (let index = 0; index < images.length; index++) {
            formData.append('images', images[index]);
        }
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