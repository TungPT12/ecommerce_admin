import React from 'react';
import styles from './Chat.module.css';
import ChatListUser from '../../components/Chat/ChatListUser/ChatListUser';
import ChatMessage from '../../components/Chat/ChatMessage/ChatMessage';

function Chat() {
    return (
        <div className={`${styles['chat']}  p-4 `}>
            <div className='h-100 d-flex flex-column'>
                <div className={`${styles['header-chat']} h-fit-content`}>
                    <h4>dsad</h4>
                    <p>asdsa</p>
                </div>
                <div className={`d- ${styles['body-chat']} w-100 d-flex h-100`}>
                    <div className='f-1 h-100'>
                        <ChatListUser />
                    </div>
                    <div className='f-4 h-100'>
                        <ChatMessage />
                        <input className={`${styles['input-message']} w-100`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;