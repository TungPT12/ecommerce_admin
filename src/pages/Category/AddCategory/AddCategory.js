import React, { useState } from 'react';
import styles from './AddCategory.module.css';
import useInput from '../../../hook/use-input';
import { uploadAnImage } from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';
import { createCategoryAdminApi } from '../../../apis/category';

function AddCategory() {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.authn)
    const [image, setImage] = useState('');
    const [errorName, setErrorTitle] = useState("Please enter category name!");
    const [errorImage, setErrorImage] = useState("");
    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
        resetInput: resetInputName,
    } = useInput(isEmptyInput, '');

    const isValidSubmit = isValidName && image

    const onSubmit = () => {
        const category = {
            name: inputName.trim(),
            image: image,
        }
        createCategoryAdminApi(token, category).then((response) => {
            if (response.status === 500) {
                throw new Error('/500');
            }
            if (response.status === 400) {
                throw new Error('/400');
            }
            if (response.status === 404) {
                throw new Error('/404');
            }
            if (response.status === 422) {
                response.data.errors.forEach((error) => {
                    if (error.path === 'title') {
                        setErrorTitle(error.msg)
                    }
                    if (error.path === 'image') {
                        setErrorImage(error.msg)
                    }
                    throw new Error('422')
                })
            }
            if (response.status === 403 || response.status === 401) {
                throw new Error(response.data.message);
            }
            alert('Successfully');
            return
        }).then(() => {
            resetInputName();
            setImage('');
            setErrorImage('')
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else if (error.message === '422') {
                navigate('/login')
            } else {
                navigate('/login')
            }
        })
    }

    const chooseImage = async (image) => {
        const data = await uploadAnImage(image);
        if (data) {
            const urlImage = data.image;
            setImage(urlImage);
        }
    }

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <img src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${image}`} className='h-100' alt='' />
        </div>
    }

    return (
        <div>
            <Card className={`${styles['header-add_area']} p-2`}>
                <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Add New</h3>
            </Card>
            <Card className={`${styles['add-area']} py-4  px-5 mt-3 mb-3`}>
                <div className={`${styles['form']} d-grid mb-3`}>
                    <div>
                        <p>Name</p>
                        <input placeholder='Category' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                            setInputName(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidName, isTouchName) ? alertMessage(errorName) : <></>}
                    </div>
                    <div>
                        <p>image</p>
                        {image ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                            {renderImage(image)}
                        </div> : <></>}
                        <input onChange={(e) => {
                            chooseImage(e.target.files[0]);
                            e.target.value = null;
                        }} type='file' className={`ps-2`} />
                        {errorImage ? alertMessage(errorImage) : <></>}
                    </div>
                </div>
                <button onClick={isValidSubmit ? onSubmit : () => {
                    onTouchedName(true);
                    setErrorImage('Invalid image')
                }} className={`${styles['btn-submit']} mt-4`}>Create</button>
            </Card>

        </div>
    );
}

export default AddCategory;