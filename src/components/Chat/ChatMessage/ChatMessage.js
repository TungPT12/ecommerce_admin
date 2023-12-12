import React from 'react';
import styles from './ChatMessage.module.css'

function ChatMessage({ messages }) {

    const renderMessages = (messages) => {
        return messages.map((message) => {
            if (message.isClient) {
                const newMessage = `<div style="display: flex; margin-top: 4px;">
                                        <div style="margin-right: 4px;">Client: </div>
                                        <div>${message.message}</div>
                                    </div>`
                return <div className={`${styles['client']} d-flex align-items-center mb-2`}>
                    <img
                        src='https://img.icons8.com/color/36/000000/administrator-male.png'
                        alt='user'
                        className='rounded-circle'
                        width='45'
                    />
                    <p className={`${styles['message']} p-1 mb-0`} dangerouslySetInnerHTML={{ __html: newMessage }}>
                    </p>
                </div>
            } else {
                const newMessage = `<div style="display: flex; margin-top: 4px;">
                                        <div style="margin-right: 4px;">You: </div>
                                        <div>${message.message}</div>
                                    </div>`
                return <div className={`${styles['admin']} w-100 d-flex justify-content-end`}>
                    <p className={`${styles['message']} p-1`} dangerouslySetInnerHTML={{ __html: newMessage }}>
                    </p>
                </div>
            }
        })
    }

    return (
        <div className={`bg-white w-100 ${styles['chat-message']} overflow-auto p-2`}>
            {renderMessages(messages)}

        </div>

    );
}

export default ChatMessage;