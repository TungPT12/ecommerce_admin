import React, { useState } from 'react';
import styles from './UpdateType.module.css';
import useInput from '../../../hook/use-input';
import uploadImage from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { createTypeAdminApi, getTypeByIdAdminApi, updateTypeByIdAdminApi } from '../../../apis/type';
import { useSelector, useDispatch } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react'
import { authnAction } from '../../../stores/slice/authn';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

function UpdateType() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector(state => state.authn)
    const [imageType, setImageType] = useState('');
    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
        resetInput: resetInputName,
    } = useInput(isEmptyInput, '');

    const isValidSubmit = isValidName

    const onSubmitUpdateType = () => {
        const type = {
            id: id,
            name: inputName.trim(),
            image: imageType,
        }
        updateTypeByIdAdminApi(token, type).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
        }).then(() => {
            alert('Successfully');
            navigate('/admin/types')
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }


    const getTypeById = (id) => {
        getTypeByIdAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            return response.data;

        }).then((data) => {
            setIsLoading(false)
            setInputName(data.name);
            setImageType(data.image);
        }).catch((error) => {
            alert(error.message);
            navigate('/admin/types')
        })
    }

    const chooseImage = async (image) => {
        const data = await uploadImage(image);
        if (data) {
            const urlImage = data.urlImage;
            setImageType(urlImage);
        }
    }

    useEffect(() => {
        getTypeById(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <img src={image} className='h-100' alt='' />
        </div>
    }

    return (
        <div>
            {
                isLoading ? <LoadingSpinner /> : <>
                    <Card className={`${styles['header-add_area']} p-2`}>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Edit Type </h3>
                    </Card>
                    <Card className={`${styles['add-area']} py-4  px-5 mt-3 mb-3`}>
                        <div className={`${styles['form']} d-grid mb-3`}>
                            <div>
                                <p>Name</p>
                                <input placeholder='Room Type' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                                    setInputName(e.target.value)
                                }} className={`${styles['input-text']}`} />
                                {isShowWarning(isValidName, isTouchName) ? alertMessage("Please enter type name!") : <></>}
                            </div>
                            <div>
                                <p>image</p>
                                {imageType ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                                    {renderImage(imageType)}
                                </div> : <></>}
                                <input onChange={(e) => {
                                    chooseImage(e.target.files[0]);
                                }} type='file' className={`ps-2`} />
                            </div>
                        </div>
                        <button onClick={isValidSubmit ? onSubmitUpdateType : () => {
                            onTouchedName(true);
                        }} className={`${styles['btn-submit']} mt-4`}>Update</button>
                    </Card>
                </>
            }
        </div>
    );
}

export default UpdateType;