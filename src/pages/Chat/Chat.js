import React from 'react';
import styles from './Chat.module.css';
import ChatListUser from '../../components/Chat/ChatListUser/ChatListUser';
import ChatMessage from '../../components/Chat/ChatMessage/ChatMessage';
import { sendMessageApi } from '../../apis/chat';

function Chat() {

    const sendMessage = (message, roomId, userId) => {
        sendMessageApi(message, roomId, userId).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className={`${styles['chat']} d-flex flex-column  p-4 `}>
            {/* <div className='h-100 d-flex flex-column'> */}
            <div className={`${styles['header-chat']} h-fit-content`}>
                <h4>dsad</h4>
                <p>asdsa</p>
            </div>
            <div className={`d- ${styles['body-chat']} w-100 d-flex`}>
                <div className='f-1 h-100 overflow-auto'>
                    <ChatListUser />
                </div>
                <div className='f-4 h-100'>
                    <ChatMessage />
                    <input className={`${styles['input-message']} w-100`} />
                    <button onClick={() => {
                        sendMessage('Hi client', 'roomId', "12445")
                    }}>Send</button>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}

export default Chat;