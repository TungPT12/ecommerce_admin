import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './AddUser.module.css';
import { isEmptyInput, isShowWarning, validPassword, validatePhoneNumber, validatedEmail } from '../../../utils/input';
import useInput from '../../../hook/use-input';

import { createUserAdminApi } from '../../../apis/user';
import { useSelector } from 'react-redux';
import alertMessage from '../../../utils/warningMessage';

function AddUser() {
    const { token } = useSelector(state => state.authn)
    const [isAdmin, setIsAdmin] = useState(false);
    const {
        isValid: isValidFullName,
        input: inputFullName,
        isTouch: isTouchFullName,
        onTouched: onTouchedFullName,
        setInput: setInputFullName,
        resetInput: resetInputFullName,
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidUserName,
        input: inputUserName,
        isTouch: isTouchUserName,
        onTouched: onTouchedUserName,
        setInput: setInputUserName,
        resetInput: resetInputUserName
    } = useInput(isEmptyInput, '');
    const {
        isValid: isValidPassword,
        input: inputPassword,
        isTouch: isTouchPassword,
        onTouched: onTouchedPassword,
        setInput: setInputPassword,
        resetInput: resetInputPassword
    } = useInput(validPassword, '');
    const {
        isValid: isValidEmail,
        input: inputEmail,
        isTouch: isTouchEmail,
        onTouched: onTouchedEmail,
        setInput: setInputEmail,
        resetInput: resetInputEmail
    } = useInput(validatedEmail, '');
    const {
        isValid: isValidPhoneNumber,
        input: inputPhoneNumber,
        isTouch: isTouchPhoneNumber,
        onTouched: onTouchedPhoneNumber,
        setInput: setInputPhoneNumber,
        resetInput: resetInputPhoneNumber
    } = useInput(validatePhoneNumber, '');

    const isValidSubmit = isValidFullName && isValidUserName && isValidPassword && isValidEmail && isValidPhoneNumber;

    const onSubmit = () => {
        const user = {
            username: inputUserName.trim(),
            password: inputPassword.trim(),
            fullName: inputFullName.trim(),
            phoneNumber: inputPhoneNumber.trim(),
            email: inputEmail.trim(),
            isAdmin: isAdmin,
        }
        createUserAdminApi(token, user).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            alert('Successfully')
        }).then(() => {
            resetInputUserName();
            resetInputFullName();
            resetInputPassword();
            resetInputPassword();
            resetInputPhoneNumber();
            resetInputEmail();
            setIsAdmin(false);
        }).catch((error) => {
            console.log(error)
            alert('Fail')
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
                        <p>User Name</p>
                        <input placeholder='User Name' value={inputUserName} onBlur={onTouchedUserName} onChange={(e) => {
                            setInputUserName(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidUserName, isTouchUserName) ? alertMessage("Please enter user name!") : <></>}
                    </div>
                    <div>
                        <p>Full Name</p>
                        <input placeholder='Full Name' value={inputFullName} onBlur={onTouchedFullName} onChange={(e) => {
                            setInputFullName(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidFullName, isTouchFullName) ? alertMessage("Please enter full name!") : <></>}
                    </div>
                    <div>
                        <p>Password</p>
                        <input placeholder='Password' value={inputPassword} onBlur={onTouchedPassword} onChange={(e) => {
                            setInputPassword(e.target.value)
                        }} className={`${styles['input-text']}`} />
                        {isShowWarning(isValidPassword, isTouchPassword) ? alertMessage("Please password must have at least 8 character!") : <></>}
                    </div>
                    <div>
                        <p>Email</p>
                        <input onBlur={onTouchedEmail} value={inputEmail} onChange={(e) => {
                            setInputEmail(e.target.value)
                        }} placeholder='Email' className={`${styles['input-text']}`} />
                        {isShowWarning(isValidEmail, isTouchEmail) ? alertMessage("Please enter email (abc@gmail.abc)!") : <></>}
                    </div>
                    <div>
                        <p>feature</p>
                        <select value={isAdmin} onChange={(e) => {
                            setIsAdmin(e.target.value)
                        }} className={`${styles['select-box-hotel_form']} w-100`}>
                            <option value={false}>User</option>
                            <option value={true}>Admin</option>
                        </select>
                    </div>
                    <div>
                        <p>Phone</p>
                        <input onBlur={onTouchedPhoneNumber} value={inputPhoneNumber} onChange={(e) => {
                            setInputPhoneNumber(e.target.value)
                        }} placeholder='Phone' className={`${styles['input-text']}`} />
                        {isShowWarning(isValidPhoneNumber, isTouchPhoneNumber) ? alertMessage("Please enter phone number and have 10 to 11 number!") : <></>}
                    </div>

                </div>
                <button onClick={isValidSubmit ? onSubmit : () => {
                    onTouchedUserName(true);
                    onTouchedEmail(true);
                    onTouchedFullName(true);
                    onTouchedPassword(true);
                    onTouchedPhoneNumber(true);
                }} className={`${styles['btn-submit']} mt-4`}>Send</button>
            </Card>
        </div>
    );
}

export default AddUser;