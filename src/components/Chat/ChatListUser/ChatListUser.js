import React from 'react';
import styles from './ChatListUser.module.css'
import ChatUser from './ChatUser/ChatUser';
import { useEffect } from 'react';

function ChatListUser({ socket, setRoomId, roomsChat, setRoomsChat, setIsLoading, setUser }) {

    // const [roomsChat, setRoomsChat] = useState([]);

    // const getRoomsChat = () => {
    //     getRoomsChatApi().then((response) => {
    //         setRoomsChat(response.data)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    // useEffect(() => {
    //     getRoomsChat();
    // }, []);

    useEffect(() => {
        socket.on('newRooms', newRoom => {
            setRoomsChat([...roomsChat, newRoom])
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomsChat]);

    const renderCardChatUser = (roomsChat) => {
        return roomsChat.map((roomChat) => {
            return <ChatUser
                key={roomChat._id}
                user={roomChat.user}
                id={roomChat._id}
                setRoomId={setRoomId}
                setIsLoading={setIsLoading}
                setUser={setUser}
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