import React from 'react';
import styles from './Chat.module.css';
import ChatListUser from '../../components/Chat/ChatListUser/ChatListUser';
import ChatMessage from '../../components/Chat/ChatMessage/ChatMessage';
import { getRoomChatApi, sendMessageApi } from '../../apis/chat';
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
function Chat() {
    const socket = io('http://localhost:5000');

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = (message, roomId) => {
        sendMessageApi(message, roomId).then((response) => {
            setMessage('');
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        socket.on(roomId, message => {
            setMessages([...messages, message]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, roomId])

    useEffect(() => {
        if (roomId) {
            getRoomChatApi(roomId).then((response) => {
                setMessages(response.data.messages);
                setIsLoading(false);
            }).catch((error) => {
                setIsLoading(false);
                console.log(error)
            })
        }
    }, [roomId])

    // const sendMessage = () => {
    //     const message = inputElement.current.outerText;
    //     sendMessageApi(message, room).then(() => {
    //         console.log("object")
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // };

    return (
        <div className={`${styles['chat']} d-flex flex-column  p-4 `}>
            <div className={`${styles['header-chat']} h-fit-content`}>
                <h4>Chat</h4>
                <p>apps / chat</p>
            </div>
            <div className={`${styles['body-chat']} w-100 d-flex`}>
                <div className='f-1 h-100 overflow-auto'>
                    <ChatListUser socket={socket} setRoomId={setRoomId} setIsLoading={setIsLoading} />
                </div>
                <div className='f-4 h-100'>
                    <div className={`${styles['wrapper-message']}`}>
                        {
                            isLoading ? <LoadingSpinner /> : (
                                roomId ? <>
                                    <ChatMessage messages={messages} />
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        sendMessage(message, roomId);
                                    }} className={`d-flex ${styles['wrapper-input-message']} p-2`}>
                                        <input placeholder='Type message' className={`${styles['input-message']} ps-2 pe-1 w-100`} value={message} onChange={(e) => {
                                            setMessage(e.target.value)
                                        }} />
                                        <button className={`${styles['send-button']} mx-2`}>
                                            <FontAwesomeIcon className={`${styles['icon-plane-paper']} text-white`} icon={faPaperPlane} />
                                        </button>
                                    </form>
                                </> : <></>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;