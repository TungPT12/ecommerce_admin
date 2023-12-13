import React from 'react';
import styles from './ChatUser.module.css'

function ChatUser({ setRoomId, user, id, setIsLoading, setUser }) {
    return (
        <div onClick={() => {
            setIsLoading(true);
            setRoomId(id);
            setUser(user)
        }} className={`w-100 ${styles['chat-user']} p-2`}>
            <img
                src='https://img.icons8.com/color/36/000000/administrator-male.png'
                alt='user'
                className='rounded-circle'
                width='45'
            />
            {user}
        </div>
    );
}

export default ChatUser;