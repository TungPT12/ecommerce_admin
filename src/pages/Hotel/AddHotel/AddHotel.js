import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './AddHotel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { isEmptyInput, isEmptySelect, isShowWarning } from '../../../utils/input';
import useInput from '../../../hook/use-input';
import uploadImage from '../../../utils/uploadImage';
import { createHotelAdminApi } from '../../../apis/hotel';
import { getAreasAdminApi } from '../../../apis/area';
import { useSelector } from 'react-redux';
import { getTypesAdminApi } from '../../../apis/type';
import alertMessage from '../../../utils/warningMessage';

function AddHotel() {
    const { token } = useSelector(state => state.authn)
    const [images, setImages] = useState([])
    const [featured, setFeature] = useState(false)
    const [area, setArea] = useState([])
    const [types, setTypes] = useState([])
    const [description, setDescription] = useState('')
    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
        resetInput: resetInputName,
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidType,
        input: inputType,
        isTouch: isTouchType,
        onTouched: onTouchedType,
        setInput: setInputType,
        resetInput: resetInputType
    } = useInput(isEmptySelect, 'none');
    const {
        isValid: isValidArea,
        input: inputArea,
        isTouch: isTouchArea,
        onTouched: onTouchedArea,
        setInput: setInputArea,
        resetInput: resetInputArea
    } = useInput(isEmptySelect, 'none');
    const {
        isValid: isValidAddress,
        input: inputAddress,
        isTouch: isTouchAddress,
        onTouched: onTouchedAddress,
        setInput: setInputAddress,
        resetInput: resetInputAddress
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidDistance,
        input: inputDistance,
        isTouch: isTouchDistance,
        onTouched: onTouchedDistance,
        setInput: setInputDistance,
        resetInput: resetInputDistance
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidTitle,
        input: inputTitle,
        isTouch: isTouchTitle,
        onTouched: onTouchedTitle,
        setInput: setInputTitle,
        resetInput: resetInputTitle
    } = useInput(isEmptyInput, '');

    const isValidSubmit = isValidName && isValidType && isValidArea && isValidTitle && isValidDistance;

    const onSubmit = () => {
        const hotel = {
            name: inputName.trim(),
            type: inputType.trim(),
            area: inputArea.trim(),
            address: inputAddress.trim(),
            title: inputTitle.trim(),
            distance: inputDistance.trim(),
            featured: featured,
            photos: images,
            desc: description.trim()
        }
        createHotelAdminApi(token, hotel).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            resetInputAddress();
            resetInputName();
            resetInputArea();
            resetInputTitle();
            resetInputType();
            resetInputDistance();
            setFeature(false);
            setImages([]);
            setDescription('')
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }

    const loadArea = () => {
        getAreasAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            setArea(response.data.results)
        }).catch((error) => {
            console.log(error)
            alert(error.message);
        })
    }
    const loadType = () => {
        getTypesAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            setTypes(response.data.results)
        }).catch((error) => {
            console.log(error)
            alert(error.message);
        })
    }

    useEffect(() => {
        loadArea();
        loadType();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chooseImage = async (image) => {
        const data = await uploadImage(image);
        if (data) {
            const urlImage = data.urlImage;
            setImages([...images, urlImage]);
        }
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
            return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
                <FontAwesomeIcon icon={faClose} className={`${styles['close-icon']}`} onClick={() => {
                    dropImage(image)
                }} />
                <img src={image} className='h-100' alt='' />
            </div>
        })
    }

    return (
        <div>
            <Card className={`${styles['header-add_hotel']} p-2`}>
                <h3 className=''>Add new </h3>
            </Card>
            <Card className={`${styles['add-hotel']} py-4  px-5 mt-3 mb-3`}>
                <div className={`${styles['form']} d-grid mb-3`}>
                    <div>
                        <p>Name</p>
                        <input placeholder='My Hotel' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                            setInputName(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidName, isTouchName) ? alertMessage("Please enter hotel name!") : <></>}
                    </div>
                    <div>
                        <p>Type</p>
                        <select onBlur={onTouchedType} value={inputType} onChange={(e) => {
                            setInputType(e.target.value)
                        }} className={`${styles['select-box-hotel_form']} w-100`}>
                            <option value="none">Select type</option>
                            {
                                types.length > 0 ? renderOption(types) : <></>
                            }
                        </select>
                        {isShowWarning(isValidType, isTouchType) ? alertMessage("Please enter type!") : <></>}
                    </div>
                    <div>
                        <p>Area</p>
                        <select onBlur={onTouchedArea} value={inputArea} onChange={(e) => {
                            setInputArea(e.target.value)
                        }} className={`${styles['select-box-hotel_form']} w-100`}>
                            <option value="none">Select area</option>
                            {
                                area.length > 0 ? renderOption(area) : <></>
                            }
                        </select>
                        {isShowWarning(isValidArea, isTouchArea) ? alertMessage("Please enter type!") : <></>}
                    </div>
                    <div>
                        <p>Address</p>
                        <input onBlur={onTouchedAddress} value={inputAddress} onChange={(e) => {
                            setInputAddress(e.target.value)
                        }} placeholder='Address' className={`${styles['input-text']}`} />
                        {isShowWarning(isValidAddress, isTouchAddress) ? alertMessage("Please enter address!") : <></>}
                    </div>
                    <div>
                        <p>Distance from Area Center</p>
                        <input onBlur={onTouchedDistance} value={inputDistance} onChange={(e) => {
                            setInputDistance(e.target.value)
                        }} placeholder='Distance' className={`${styles['input-text']}`} />
                        {isShowWarning(isValidDistance, isTouchDistance) ? alertMessage("Please enter distance!") : <></>}
                    </div>
                    <div>
                        <p>title</p>
                        <input onBlur={onTouchedTitle} value={inputTitle} onChange={(e) => {
                            setInputTitle(e.target.value)
                        }} placeholder='Title' className={`${styles['input-text']}`} />
                        {isShowWarning(isValidTitle, isTouchTitle) ? alertMessage("Please enter title!") : <></>}
                    </div>
                    <div>
                        <p>images</p>
                        {images.length > 0 ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                            {renderImages(images)}
                        </div> : <></>}
                        <input onChange={(e) => {
                            chooseImage(e.target.files[0]);
                            e.target.value = null
                        }} type='file' className={`ps-2`} accept=".jpg, .jpeg, .png" />
                    </div>
                    <div>
                        <p>feature</p>
                        <select value={featured} onChange={(e) => {
                            setFeature(e.target.value)
                        }} className={`${styles['select-box-hotel_form']} w-100`}>
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                        </select>
                    </div>
                </div>
                <div className={`${styles['description']} w-100`}>
                    <p className='text-capitalize'>Description</p>
                    <textarea className='w-100 outline-none' value={description} onChange={(e) => {
                        setDescription(e.target.value);
                    }}></textarea>
                </div>
                <button onClick={isValidSubmit ? onSubmit : () => {
                    onTouchedName(true);
                    onTouchedType(true);
                    onTouchedArea(true);
                    onTouchedAddress(true);
                    onTouchedTitle(true);
                }} className={`${styles['btn-submit']} mt-4`}>Send</button>
            </Card>
        </div>
    );
}

export default AddHotel;