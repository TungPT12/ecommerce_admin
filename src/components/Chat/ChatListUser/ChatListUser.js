import React from 'react';
import styles from './ChatListUser.module.css'
import ChatUser from './ChatUser/ChatUser';
import { useEffect, useState } from 'react';
import { getRoomsChatApi } from '../../../apis/chat';

function ChatListUser({ socket, setRoomId, setIsLoading }) {

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

    useEffect(() => {
        socket.on('newRooms', newRoom => {
            setRoomsChat([...roomsChat, newRoom])
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCardChatUser = (roomsChat) => {
        return roomsChat.map((roomChat) => {
            return <ChatUser
                user={roomChat.user}
                id={roomChat._id}
                setRoomId={setRoomId}
                setIsLoading={setIsLoading}
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