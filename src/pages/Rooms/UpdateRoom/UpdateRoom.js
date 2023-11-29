import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './UpdateRoom.module.css';
import { isEmptyInput, isShowWarning, isValidInputRooms, isZeroInput, isZeroInputInt } from '../../../utils/input';
import useInput from '../../../hook/use-input';
import { getRoomByIdAdminApi, updateRoomByIdAdminApi } from '../../../apis/room';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import alertMessage from '../../../utils/warningMessage';

function UpdateRoom() {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.authn)
    // const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const {
        isValid: isValidTitle,
        input: inputTitle,
        isTouch: isTouchTitle,
        onTouched: onTouchedTitle,
        setInput: setInputTitle,
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidDescription,
        input: inputDescription,
        isTouch: isTouchDescription,
        onTouched: onTouchedDescription,
        setInput: setInputDescription,
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidPrice,
        input: inputPrice,
        isTouch: isTouchPrice,
        onTouched: onTouchedPrice,
        setInput: setInputPrice,
    } = useInput(isZeroInput, 0);
    const {
        isValid: isValidMaxPeople,
        input: inputMaxPeople,
        isTouch: isTouchMaxPeople,
        onTouched: onTouchedMaxPeople,
        setInput: setInputMaxPeople,
    } = useInput(isZeroInputInt, 1);
    const {
        isValid: isValidRooms,
        input: inputRooms,
        isTouch: isTouchRooms,
        onTouched: onTouchedRooms,
        setInput: setInputRooms,
    } = useInput(isValidInputRooms, '');

    const parseRoomNumberToArray = (inputRoomNumbers) => {
        return inputRoomNumbers.split(',').map((number) => {
            return parseInt(number.trim());
        });
    }
    const isValidSubmit = isValidTitle && isValidDescription && isValidPrice && isValidMaxPeople && isValidRooms;

    const onSubmitUpdateRoom = () => {
        const room = {
            id: id,
            title: inputTitle.trim(),
            price: parseFloat(inputPrice),
            maxPeople: parseInt(inputMaxPeople),
            desc: inputDescription.trim(),
            roomNumbers: parseRoomNumberToArray(inputRooms),
        }
        updateRoomByIdAdminApi(token, room).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
            navigate('/admin/rooms')
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }

    const loadRoomById = (id) => {
        getRoomByIdAdminApi(token, id).then((response) => {
            setIsLoading(false);
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            return response.data;
        }).then((data) => {
            setInputTitle(data.title);
            setInputDescription(data.desc);
            setInputPrice(data.price);
            setInputMaxPeople(data.maxPeople);
            setInputRooms(data.roomNumbers.join(', '));
        }).catch((error) => {
            console.log(error)
            alert(error.message);
        })
    }

    useEffect(() => {
        loadRoomById(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            {
                isLoading ?
                    <LoadingSpinner /> : <>
                        <Card className={`${styles['header-add_hotel']} p-2`}>
                            <h3 className='ps-4 text-capitalize'>edit room</h3>
                        </Card>
                        <Card className={`${styles['add-hotel']} py-4  px-5 mt-3 mb-3`}>
                            <div className={`${styles['form']} d-grid mb-3`}>
                                <div>
                                    <p>title</p>
                                    <input placeholder='room name' value={inputTitle} onBlur={onTouchedTitle} onChange={(e) => {
                                        setInputTitle(e.target.value)
                                    }} className={`${styles['input-text']}`} />
                                    {isShowWarning(isValidTitle, isTouchTitle) ? alertMessage("Please enter room name!") : <></>}
                                </div>
                                <div>
                                    <p>description</p>
                                    <input placeholder='description' value={inputDescription} onBlur={onTouchedDescription} onChange={(e) => {
                                        setInputDescription(e.target.value)
                                    }} className={`${styles['input-text']}`} />
                                    {isShowWarning(isValidDescription, isTouchDescription) ? alertMessage("Please enter room description!") : <></>}
                                </div>
                                <div>
                                    <p>price</p>
                                    <input type='number' min="0" step="1" onBlur={onTouchedPrice} onChange={(e) => {
                                        setInputPrice(e.target.value)
                                    }} value={inputPrice} placeholder='Price' className={`${styles['input-text']}`} />
                                    {isShowWarning(isValidPrice, isTouchPrice) ? alertMessage("Please enter Price") : <></>}
                                </div>
                                <div>
                                    <p>max people</p>
                                    <input type='number' min="0" max="4" step="1" onBlur={onTouchedMaxPeople} onChange={(e) => {
                                        setInputMaxPeople(e.target.value)
                                    }} value={inputMaxPeople} placeholder='Max Peple' className={`${styles['input-text']}`} />
                                    {isShowWarning(isValidMaxPeople, isTouchMaxPeople) ? alertMessage("Please enter number people!") : <></>}
                                </div>
                                <div>
                                    <p>Rooms</p>
                                    <textarea value={inputRooms} onBlur={onTouchedRooms} onChange={(e) => {
                                        setInputRooms(e.target.value)
                                    }} className='w-100  outline-none' placeholder="give comma between room numbers" ></textarea>
                                    {isShowWarning(isValidRooms, isTouchRooms) ? alertMessage("Please enter rooms number!") : <></>}
                                </div>
                            </div>
                            <button onClick={isValidSubmit ? onSubmitUpdateRoom : () => {
                                onTouchedTitle(true);
                                onTouchedDescription(true);
                                onTouchedMaxPeople(true);
                                onTouchedPrice(true);
                                onTouchedRooms(true)
                            }} className={`${styles['btn-submit']} mt-4`}>Update</button>
                        </Card>
                    </>
            }
        </div>
    );
}

export default UpdateRoom;