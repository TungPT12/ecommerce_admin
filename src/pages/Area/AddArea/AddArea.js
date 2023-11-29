import React, { useState } from 'react';
import styles from './AddArea.module.css';
import useInput from '../../../hook/use-input';
import uploadImage from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { createAreaAdminApi } from '../../../apis/area';
import { useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';

function AddArea() {
    const { token } = useSelector(state => state.authn)
    const [imageArea, setImageArea] = useState('')
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
        const area = {
            name: inputName.trim(),
            backgroundImage: imageArea,
        }
        createAreaAdminApi(token, area).then((response) => {
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
            setImageArea('');
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }

    const chooseImage = async (image) => {
        const data = await uploadImage(image);
        if (data) {
            const urlImage = data.urlImage;
            setImageArea(urlImage);
        }
    }

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <img src={image} className='h-100' alt='' />
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
                        <input placeholder='My Hotel' value={inputName} onBlur={onTouchedName} onChange={(e) => {
                            setInputName(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidName, isTouchName) ? alertMessage("Please enter area name!") : <></>}
                    </div>
                    <div>
                        <p>image</p>
                        {imageArea ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                            {/* {renderImage(imageArea)} */}
                        </div> : <></>}
                        <input onChange={(e) => {
                            chooseImage(e.target.files[0]);
                            e.target.value = null;
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

export default AddArea;