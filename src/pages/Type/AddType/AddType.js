import React, { useState } from 'react';
import styles from './AddType.module.css';
import useInput from '../../../hook/use-input';
import uploadImage from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { createTypeAdminApi } from '../../../apis/type';
import { useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';

function AddType() {
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

    const onSubmit = () => {
        const type = {
            name: inputName.trim(),
            image: imageType,
        }
        createTypeAdminApi(token, type).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            resetInputName();
            setImageType('');
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }

    const chooseImage = async (image) => {
        const data = await uploadImage(image);
        if (data) {
            const urlImage = data.urlImage;
            setImageType(urlImage);
        }
    }

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <FontAwesomeIcon icon={faClose} className={`${styles['close-icon']}`} />
            <img src={image} className='h-100' alt='' />
        </div>
    }

    return (
        <div>
            <Card className={`${styles['header-add_area']} p-2`}>
                <h3 className=''>Add new </h3>
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
                <button onClick={isValidSubmit ? onSubmit : () => {
                    onTouchedName(true);
                }} className={`${styles['btn-submit']} mt-4`}>Send</button>
            </Card>
        </div>
    );
}

export default AddType;