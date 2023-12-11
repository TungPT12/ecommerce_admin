import React from 'react';
import styles from './ChatListUser.module.css'
import ChatUser from './ChatUser/ChatUser';
import { useEffect, useState } from 'react';
import { getRoomsChatApi } from '../../../apis/chat';

function ChatListUser({ setRoomId }) {

    const [roomsChat, setRoomsChat] = useState([]);

    const getRoomsChat = () => {
        getRoomsChatApi().then((response) => {
            setRoomsChat(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getRoomsChat();
    }, []);

    const renderCardChatUser = (roomsChat) => {
        return roomsChat.map((roomChat) => {
            return <ChatUser
                user={roomChat.user}
                id={roomChat._id}
                setRoomId={setRoomId}
            />
        })
    }

    return (
        <div className={`bg-white w-100 h-100 overflow-auto ${styles['chat-list-user']}`}>
            <div className='h-50'>
                {renderCardChatUser(roomsChat)}
            </div>
        </div>
    );
}

export default ChatListUser;