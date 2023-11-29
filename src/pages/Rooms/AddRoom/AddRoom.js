import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './AddRoom.module.css';
import { isEmptyInput, isEmptySelect, isShowWarning, isValidInputRooms, isZeroInput, isZeroInputInt } from '../../../utils/input';
import useInput from '../../../hook/use-input';
import { createRoomAdminApi } from '../../../apis/room';
import { getAllHotelAdminApi } from '../../../apis/hotel';
import { useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';

function AddRoom() {
    const { token } = useSelector(state => state.authn)
    const [hotels, setHotels] = useState([]);
    const {
        isValid: isValidTitle,
        input: inputTitle,
        isTouch: isTouchTitle,
        onTouched: onTouchedTitle,
        setInput: setInputTitle,
        resetInput: resetInputTitle
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidDescription,
        input: inputDescription,
        isTouch: isTouchDescription,
        onTouched: onTouchedDescription,
        setInput: setInputDescription,
        resetInput: resetInputDescription
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidPrice,
        input: inputPrice,
        isTouch: isTouchPrice,
        onTouched: onTouchedPrice,
        setInput: setInputPrice,
        resetInput: resetInputPrice
    } = useInput(isZeroInput, 0);
    const {
        isValid: isValidMaxPeople,
        input: inputMaxPeople,
        isTouch: isTouchMaxPeople,
        onTouched: onTouchedMaxPeople,
        setInput: setInputMaxPeople,
        resetInput: resetInputMaxPeople
    } = useInput(isZeroInputInt, 1);
    const {
        isValid: isValidHotel,
        input: inputHotel,
        isTouch: isTouchHotel,
        onTouched: onTouchedHotel,
        setInput: setInputHotel,
        resetInput: resetInputHotel
    } = useInput(isEmptySelect, 'none');
    const {
        isValid: isValidRooms,
        input: inputRooms,
        isTouch: isTouchRooms,
        onTouched: onTouchedRooms,
        setInput: setInputRooms,
        resetInput: resetInputRooms
    } = useInput(isValidInputRooms, '');

    const isValidSubmit = isValidTitle && isValidDescription && isValidPrice && isValidMaxPeople && isValidRooms;

    const onSubmit = () => {
        const room = {
            title: inputTitle.trim(),
            price: parseFloat(inputPrice),
            maxPeople: parseInt(inputMaxPeople),
            desc: inputDescription.trim(),
            roomNumbers: inputRooms.split(',').map((number) => {
                return parseInt(number.trim());
            }),
            hotelID: inputHotel.trim(),
        }
        createRoomAdminApi(token, room).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            resetInputTitle();
            resetInputMaxPeople();
            resetInputHotel();
            resetInputPrice();
            resetInputDescription();
            resetInputRooms();
        }).catch((error) => {
            console.log(error)
            alert('Fail')
        })
    }

    useEffect(() => {
        getAllHotelAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            setHotels(response.data.results)

        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderOptionHotels = (hotels) => {
        return hotels.map((hotel) => {
            return <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
        })
    }

    return (
        <div>
            <Card className={`${styles['header-add_hotel']} p-2`}>
                <h3 className='ps-4 text-capitalize'>Add new room</h3>
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
                    <div>
                        <p>choose a hotel</p>
                        <select value={inputHotel} onBlur={onTouchedHotel} onChange={(e) => {
                            setInputHotel(e.target.value)
                        }} className={`${styles['select-box-hotel_form']} w-100`}>
                            <option value={`none`}>Select hotels</option>
                            {renderOptionHotels(hotels)}
                        </select>
                        {isShowWarning(isValidHotel, isTouchHotel) ? alertMessage("Please enter hotel!") : <></>}
                    </div>
                </div>
                <button onClick={isValidSubmit ? onSubmit : () => {
                    onTouchedTitle(true);
                    onTouchedDescription(true);
                    onTouchedMaxPeople(true);
                    onTouchedPrice(true);
                    onTouchedHotel(true);
                    onTouchedRooms(true)
                    // onTouchedTitle(true);
                }} className={`${styles['btn-submit']} mt-4`}>Send</button>
            </Card>
        </div>
    );
}

export default AddRoom;