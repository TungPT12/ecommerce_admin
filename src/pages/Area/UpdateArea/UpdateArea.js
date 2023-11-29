import React, { useEffect, useState } from 'react';
import styles from './UpdateArea.module.css';
import useInput from '../../../hook/use-input';
import uploadImage from '../../../utils/uploadImage';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { isEmptyInput, isShowWarning } from '../../../utils/input';
import { getAreaByIdAdminApi, updateAreaByIdAdminApi } from '../../../apis/area';
import { useDispatch, useSelector } from 'react-redux';
import { authnAction } from '../../../stores/slice/authn';
import { useNavigate, useParams } from 'react-router-dom';
import alertMessage from '../../../utils/warningMessage';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

function UpdateArea() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.authn)
    const [imageArea, setImageArea] = useState('');
    const {
        isValid: isValidName,
        input: inputName,
        isTouch: isTouchName,
        onTouched: onTouchedName,
        setInput: setInputName,
    } = useInput(isEmptyInput, '');

    const isValidSubmit = isValidName && imageArea

    const onSubmitUpdateArea = () => {
        const area = {
            name: inputName.trim(),
            backgroundImage: imageArea,
        }
        updateAreaByIdAdminApi(token, area, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            navigate('/admin/areas')
        }).catch((error) => {
            console.log(error)
            alert(error.message)
        })
    }

    const chooseImage = async (image) => {
        const data = await uploadImage(image);
        if (data) {
            const urlImage = data.urlImage;
            setImageArea(urlImage);
        }
    }

    useEffect(() => {
        getAreaByIdAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                dispatch(authnAction.logout());
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            const area = response.data;
            setIsLoading(false);
            setInputName(area.name);
            setImageArea(area.backgroundImage);
        }).catch((error) => {
            alert(error.message);
            navigate('/admin/areas')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderImage = (image) => {
        return <div key={image} className={`${styles['image-wrapper']} position-relative w-100 d-flex justify-content-center`}>
            <FontAwesomeIcon icon={faClose} className={`${styles['close-icon']}`} />
            <img src={image} className='h-100' alt='' />
        </div>
    }

    return (
        <div>
            {
                isLoading ? <LoadingSpinner /> : <>
                    <Card className={`${styles['header-update_area']} p-2`}>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Add new </h3>
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
                                {imageArea ? <div className={`${styles['list-image']} d-grid position-relative px-2 mb-2`}>
                                    {renderImage(imageArea)}
                                </div> : <></>}
                                <input onChange={(e) => {
                                    chooseImage(e.target.files[0]);
                                }} type='file' className={`ps-2`} />
                                {imageArea ? <></> : alertMessage("Please choose a image!")}
                            </div>
                        </div>
                        <button onClick={isValidSubmit ? onSubmitUpdateArea : () => {
                            onTouchedName(true);
                        }} className={`${styles['btn-submit']} mt-4`}>Update</button>
                    </Card>
                </>
            }
        </div>
    );
}

export default UpdateArea;