import React from 'react';
import styles from './ChatUser.module.css'

function ChatUser({ setRoomId, user, id }) {
    return (
        <div onClick={() => {
            setRoomId(id)
        }} className={`bg-white w-100 ${styles['chat-user']}`}>
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