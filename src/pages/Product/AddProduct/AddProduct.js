import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './AddProduct.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { isEmptyInput, isEmptySelect, isShowWarning, isZeroInput } from '../../../utils/input';
import useInput from '../../../hook/use-input';
import { uploadImages } from '../../../utils/uploadImage';
import { useDispatch, useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';
import { authnAction } from '../../../stores/slice/authn';
import { useNavigate } from 'react-router-dom';
import { checkIsLoginApi } from '../../../apis/authn';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { getCategoriesAdminApi } from '../../../apis/category';
import LoadingSpinnerModal from '../../../components/LoadingSpinnerModal/LoadingSpinnerModal';

function AddProduct() {
    const { token, isAuthn } = useSelector(state => state.authn)
    const [images, setImages] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSpinnerModal, setIsLoadingSpinnerModal] = useState(false);
    // const [types, setTypes] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
        resetInput: resetInputName,
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidPrice,
        input: inputPrice,
        isTouch: isTouchPrice,
        onTouched: onTouchedPrice,
        setInput: setInputPrice,
        resetInput: resetInputPrice,
    } = useInput(isZeroInput, '');
    const {
        isValid: isValidCategory,
        input: inputCategory,
        isTouch: isTouchCategory,
        onTouched: onTouchedCategory,
        setInput: setInputCategory,
        resetInput: resetInputCategory
    } = useInput(isEmptySelect, 'none');
    const {
        isValid: isValidShortDescription,
        input: inputShortDescription,
        isTouch: isTouchShortDescription,
        onTouched: onTouchedShortDescription,
        setInput: setInputShortDescription,
        resetInput: resetInputShortDescription
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidLongDescription,
        input: inputLongDescription,
        isTouch: isTouchLongDescription,
        onTouched: onTouchedLongDescription,
        setInput: setInputLongDescription,
        resetInput: resetInputLongDescription
    } = useInput(isEmptyInput, '');


    const isValidSubmit = isValidName && isValidCategory && isValidLongDescription && isValidShortDescription;

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

    const onSubmit = () => {
        // const hotel = {
        //     name: inputName.trim(),
        //     category: inputCategory.trim(),
        //     area: inputShortDescription.trim(),
        //     address: inputLongDescription.trim(),
        //     title: inputTitle.trim(),
        //     distance: inputDistance.trim(),
        //     featured: featured,
        //     photos: images,
        //     desc: description.trim()
        // }
        // createHotelAdminApi(token, hotel).then((response) => {
        //     if (response.status === 403 || response.status === 401) {
        //         localStorage.removeItem('bookingAdminToken');
        //         window.location.href = '/admin/login'
        //     }
        //     if (response.status !== 200) {
        //         throw new Error(response.data.message);
        //     }
        //     alert('Successfully')
        // }).then(() => {
        //     resetInputAddress();
        //     resetInputName();
        //     resetInputArea();
        //     resetInputTitle();
        //     resetInputType();
        //     resetInputDistance();
        //     setFeature(false);
        //     setImages([]);
        //     setDescription('')
        // }).catch((error) => {
        //     console.log(error)
        //     alert('Fail')
        // })
    }

    const loadCategories = () => {
        getCategoriesAdminApi(token).then((response) => {
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
            setIsLoading(false)
            setCategories(response.data.results)
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/admin/signin')
            }
        })
    }


    useEffect(() => {
        // loadArea();
        // loadType();
        if (!isAuthn) {
            checkIsLogin();
        } else {
            loadCategories()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthn])

    const chooseImage = async (files) => {
        const listImage = await uploadImages(files);
        setImages([...images, ...listImage.images]);

    }

    const renderOption = (options) => {
        return options.map((option) => {
            return <option key={option._id} value={option._id}>{option.name}</option>
        })
    }

    const dropImage = (imgLink) => {
        const newImages = images.filter((image) => {
            return imgLink !== image
        })
        setImages(newImages)
    }

    const renderImages = (images) => {
        return images.map((image) => {
            return <div key={image} className={`${styles['image-wrapper']} position-relative d-flex justify-content-center`}>
                <FontAwesomeIcon icon={faClose} className={`${styles['close-icon']}`} onClick={() => {
                    dropImage(image)
                }} />
                <img src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${image}`} className='w-100 h-auto' alt='' />
            </div>
        })
    }

    return (
        <div>
            {isLoadingSpinnerModal ? <LoadingSpinnerModal /> : <></>}
            {
                isAuthn ? (
                    isLoading ? <LoadingSpinner /> : <>
                        <Card className={`${styles['header-add_hotel']} p-2`}>
                            <h3 className=''>Add new </h3>
                        </Card>
                        <Card className={`${styles['add-product']} py-4  px-5 mt-3 mb-3`}>
                            <div className={`${styles['form']}  d-grid mb-3`}>
                                <div>
                                    <p>Name</p>
                                    <input placeholder='Enter Product Name' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                                        setInputName(e.target.value)
                                    }} className={`${styles['input-text']} py-1`} />
                                    {isShowWarning(isValidName, isTouchName) ? alertMessage("Please enter product name!") : <></>}
                                </div>
                                <div>
                                    <p>Price</p>
                                    <input type="number" placeholder='Price' value={inputPrice} onBlur={onTouchedPrice} onChange={(e) => {
                                        setInputPrice(e.target.value)
                                    }} className={`${styles['input-text']} py-1`} />
                                    {isShowWarning(isValidPrice, isTouchPrice) ? alertMessage("Please enter price name!") : <></>}
                                </div>
                                <div>
                                    <p>Category</p>
                                    <select onBlur={onTouchedCategory} value={inputCategory} onChange={(e) => {
                                        setInputCategory(e.target.value)
                                    }} className={`${styles['select-box-hotel_form']} w-100  outline-none`}>
                                        <option className={`${styles['first-option']}`} value="none">Select Category</option>
                                        {
                                            categories.length > 0 ? renderOption(categories) : <></>
                                        }
                                    </select>
                                    {isShowWarning(isValidCategory, isTouchCategory) ? alertMessage("Please select category!") : <></>}
                                </div>
                                <div>
                                    <p>images</p>
                                    {images.length > 0 ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                                        {renderImages(images)}
                                    </div> : <></>}
                                    <input multiple onChange={(e) => {
                                        chooseImage(e.target.files);
                                        e.target.value = null
                                    }} type='file' className={`ps-2`} accept=".jpg, .jpeg, .png" />
                                </div>
                            </div>
                            <div className="mb-3">
                                <p className={`${styles['title-input']} text-capitalize`}>Short Description</p>
                                <textarea placeholder="Enter Short Description" onClick={onTouchedShortDescription} className={`${styles['short-description']} p-1 w-100 outline-none`} value={inputShortDescription} onChange={(e) => {
                                    setInputShortDescription(e.target.value);
                                }}></textarea>
                                {isShowWarning(isValidShortDescription, isTouchShortDescription) ? alertMessage("Please enter short description!") : <></>}
                            </div>
                            <div className={`${styles['description']} w-100`}>
                                <p className={`${styles['title-input']} text-capitalize`}>Long Description</p>
                                <textarea placeholder="Enter Long Description" onClick={onTouchedLongDescription} className={`${styles['long-description']} p-1 w-100 outline-none`} value={inputLongDescription} onChange={(e) => {
                                    setInputLongDescription(e.target.value);
                                }}></textarea>
                                {isShowWarning(isValidLongDescription, isTouchLongDescription) ? alertMessage("Please enter long description!") : <></>}
                            </div>
                            <button onClick={isValidSubmit ? onSubmit : () => {
                                onTouchedName(true);
                                onTouchedCategory(true);
                                onTouchedPrice(true);
                                onTouchedShortDescription(true);
                                onTouchedLongDescription(true);
                            }} className={`${styles['btn-submit']} mt-4`}>Send</button>
                        </Card>
                    </>
                ) : <></>
            }
        </div>
    );
}

export default AddProduct;