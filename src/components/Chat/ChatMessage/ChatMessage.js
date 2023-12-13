import React from 'react';
import styles from './ChatMessage.module.css'
import { destroyRoomChatApi } from '../../../apis/chat';

function ChatMessage({ messages, user, destroyRoomChat }) {

    // const destrooyRoomChat = () => {
    //      destroyRoomChatApi().then((response) => {
    //         setRoomsChat(response.data)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    const renderMessages = (messages) => {
        return messages.map((message) => {
            if (message.isClient) {
                const newMessage = `<div style="display: flex; margin-top: 4px;">
                                        <div style="margin-right: 4px;">Client: </div>
                                        <div style="word-break: break-word;">${message.message}</div>
                                    </div>`
                return <div className={`${styles['client']} d-flex align-items-center mb-2`}>
                    <img
                        src='https://img.icons8.com/color/36/000000/administrator-male.png'
                        alt='user'
                        className='rounded-circle'
                        width='40'
                    />
                    <p className={`${styles['message']} p-1 mb-0`} dangerouslySetInnerHTML={{ __html: newMessage }}>
                    </p>
                </div>
            } else {
                const newMessage = `<div style="display: flex; margin-top: 4px;">
                                        <div style="margin-right: 4px;w">You: </div>
                                        <div style="word-break: break-word;">${message.message}</div>
                                    </div>`
                return <div className={`${styles['admin']} w-100 d-flex justify-content-end`}>
                    <p className={`${styles['message']} p-1`} dangerouslySetInnerHTML={{ __html: newMessage }}>
                    </p>
                </div>
            }
        })
    }

    return (
        <div className={`bg-white w-100 ${styles['chat-message']} position-relative overflow-auto `}>
            <div className={`${styles['header-message']} d-flex justify-content-between p-2 position-sticky top-0 w-100`}>
                <div className='d-flex align-items-center text-light'>
                    <img
                        src='https://img.icons8.com/color/36/000000/administrator-male.png'
                        alt='user'
                        className='rounded-circle'
                        width='45'
                    />
                    <p className={`m-0`}>User: {user}</p>
                </div>
                <button onClick={destroyRoomChat} className={`text-danger border-0 ${styles['end-chat']}`}>end chat</button>
            </div>
            <div className='p-2'>
                {renderMessages(messages)}
            </div>
        </div>

    );
}

export default ChatMessage;