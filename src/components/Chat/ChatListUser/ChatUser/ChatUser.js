import React from 'react';
import styles from './ChatUser.module.css'
import { useSelector } from 'react-redux';

function ChatUser({ setRoomId, user, id, setIsLoading, setUser }) {
    const { isAdmin } = useSelector(state => state.authn)

    return (
        <div onClick={() => {
            setIsLoading(true);
            setRoomId(id);
            setUser(user)
        }} className={`w-100 ${styles['chat-user']} p-2 font-size-16px`}>
            <img
                src='https://img.icons8.com/color/36/000000/administrator-male.png'
                alt='user'
                className='rounded-circle'
                width={`${isAdmin ? '35' : '45'}`}
            />
            <span className={`${isAdmin ? 'font-size-14px' : ""}`}>{user}</span>
        </div>
    );
}

export default ChatUser;