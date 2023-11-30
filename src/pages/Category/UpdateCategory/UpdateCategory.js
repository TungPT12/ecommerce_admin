import React, { useEffect, useState } from 'react';
import styles from './UpdateCategory.module.css';
import useInput from '../../../hook/use-input';
import { uploadAnImage } from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { useDispatch, useSelector } from 'react-redux';
import { authnAction } from '../../../stores/slice/authn';
import { useNavigate, useParams } from 'react-router-dom';
import alertMessage from '../../../utils/warningMessage';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getCategoryByIdAdminApi, updateCategoryByIdAdminApi } from '../../../apis/category';
import { checkIsLoginApi } from '../../../apis/authn';

function UpdateCategory() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { token, isAuthn } = useSelector(state => state.authn);
    const [isLoading, setIsLoading] = useState(true)
    const [image, setImage] = useState('');

    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
    } = useInput(isEmptyInput, '');

    const isValidSubmit = isValidName && image

    const checkIsLogin = () => {
        checkIsLoginApi().then((response) => {
            if (response.status === 500) {
                throw new Error('/500');
            }
            if (response.status === 400) {
                throw new Error('/400');
            }
            if (response.status === 404) {
                throw new Error('/404');
            }
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                throw new Error(response.data.message);
            }
            return response.data
        }).then((data) => {
            dispatch(authnAction.login(data))
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/admin/signin')
            }
        })
    }

    const onSubmitUpdateCategory = () => {
        const category = {
            name: inputName.trim(),
            image: image,
        }
        updateCategoryByIdAdminApi(token, category, id).then((response) => {
            if (response.status === 500) {
                throw new Error('/500');
            }
            if (response.status === 400) {
                throw new Error('/400');
            }
            if (response.status === 404) {
                throw new Error('/404');
            }
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            navigate('/admin/category')
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/admin/signin')
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

    const getCategoryById = (token, id) => {
        getCategoryByIdAdminApi(token, id).then((response) => {
            if (response.status === 500) {
                throw new Error('/500');
            }
            if (response.status === 400) {
                throw new Error('/400');
            }
            if (response.status === 404) {
                throw new Error('/404');
            }
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                throw new Error(response.data.message);
            }
            const category = response.data;
            setIsLoading(false);
            setInputName(category.name);
            setImage(category.image);
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/admin/signin')
            }
        })
    }

    useEffect(() => {
        if (!isAuthn) {
            checkIsLogin()
        } else {
            getCategoryById(token, id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthn]);

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <img src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${image}`} className='h-100' alt='' />
        </div>
    }

    return (
        <div>
            {
                isLoading ? <LoadingSpinner /> : <>
                    <Card className={`${styles['header-update_area']} p-2`}>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Update Catgory</h3>
                    </Card>
                    <Card className={`${styles['update-area']} py-4  px-5 mt-3 mb-3`}>
                        <div className={`${styles['form']} d-grid mb-3`}>
                            <div>
                                <p>Name</p>
                                <input placeholder='My Hotel' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                                    setInputName(e.target.value)
                                }} className={`${styles['input-text']}`} />
                                {isShowWarning(isValidName, isTouchName) ? alertMessage("Please enter area name!") : <></>}
                            </div>
                            <div>
                                <p>image</p>
                                {image ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                                    {renderImage(image)}
                                </div> : <></>}
                                <input onChange={(e) => {
                                    chooseImage(e.target.files[0]);
                                }} type='file' className={`ps-2`} />
                                {image ? <></> : alertMessage("Please choose a image!")}
                            </div>
                        </div>
                        <button onClick={isValidSubmit ? onSubmitUpdateCategory : () => {
                            onTouchedName(true);
                        }} className={`${styles['btn-submit']} mt-4`}>Update</button>
                    </Card>
                </>
            }
        </div>
    );
}

export default UpdateCategory;