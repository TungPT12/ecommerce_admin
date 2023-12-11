import React from 'react';
import styles from './ChatMessage.module.css'

function ChatMessage() {
    return (
        <div className={`bg-white w-100 ${styles['chat-message']} p-2`}>
            <div className={`${styles['client']} d-flex`}>
                <img
                    src='https://img.icons8.com/color/36/000000/administrator-male.png'
                    alt='user'
                    className='rounded-circle'
                    width='45'
                /> 
                <p className={`${styles['message']} p-1`}>
                    Client: {"hi amdin"}
                </p>
            </div>
            <div className={`${styles['admin']}`}>
                <p className={`${styles['message']} p-1`}>
                    You: {"Chao ban"}
                </p>
            </div>
            <div>

            </div>
        </div>
    );
}

export default ChatMessage;