import React from 'react';
import styles from './ChatMessage.module.css'

function ChatMessage() {
    return (
        <div className={`bg-white w-100 ${styles['message']}`}>
            message
        </div>
    );
}

export default ChatMessage;