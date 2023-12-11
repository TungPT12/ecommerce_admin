import React from 'react';
import styles from './ChatListUser.module.css'
import ChatUser from './ChatUser/ChatUser';

function ChatListUser() {
    return (
        <div className={`bg-white w-100 h-100 overflow-auto ${styles['chat-list-user']}`}>
            <div className='h-50'>
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />
                <ChatUser />

                <ChatUser />
                <ChatUser />
                <ChatUser />
            </div>
        </div>
    );
}

export default ChatListUser;