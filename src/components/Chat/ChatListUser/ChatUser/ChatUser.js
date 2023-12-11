import React from 'react';
import styles from './ChatUser.module.css'

function ChatUser() {
    return (
        <div className={`bg-white w-100 ${styles['chat-user']}`}>
            <img
                src='https://img.icons8.com/color/36/000000/administrator-male.png'
                alt='user'
                className='rounded-circle'
                width='45'
            />
            {"<sadgsadasjdsagdjhddddđ"}
        </div>
    );
}

export default ChatUser;