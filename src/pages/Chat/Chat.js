import React from 'react';
import styles from './Chat.module.css';
import ChatListUser from '../../components/Chat/ChatListUser/ChatListUser';
import ChatMessage from '../../components/Chat/ChatMessage/ChatMessage';
import { destroyRoomChatApi, getRoomChatApi, getRoomsChatApi, sendMessageApi } from '../../apis/chat';
import { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { authnAction } from '../../stores/slice/authn';
import { useNavigate } from 'react-router-dom';
import { checkIsLoginApi } from '../../apis/authn';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Chat() {
    const socket = io('http://localhost:5000');
    const { avatar, email, fullName, isAuthn, isAdmin } = useSelector(state => state.authn)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const [user, setUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRoomsChat, setIsLoadingRoomsChat] = useState(true);
    const [roomsChat, setRoomsChat] = useState([]);

    const getRoomsChat = () => {
        getRoomsChatApi().then((response) => {
            setRoomsChat(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }
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
                // setIsLoading(false);
            }).catch((error) => {
                console.log(error)
            })
        }
        setIsLoading(false);
    }, [roomId])

    const destroyRoomChat = () => {
        destroyRoomChatApi(roomId).then((response) => {
            const newRoomsChat = roomsChat;
            const position = newRoomsChat.findIndex((roomChat) => {
                return roomChat._id === roomId;
            })
            newRoomsChat.splice(position, 1);
            setRoomsChat([...newRoomsChat])
            setRoomId("");
        }).catch((error) => {
            console.log(error)
        })
    }


    // const sendMessage = () => {
    //     const message = inputElement.current.outerText;
    //     sendMessageApi(message, room).then(() => {
    //         console.log("object")
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // };
    const checkIsLogin = () => {
        checkIsLoginApi().then((response) => {
            if (response.status === 500) {
                throw new Error('/500');
            }
            if (response.status === 400) {
                throw new Error('/400');
            }
            if (response.status === 404) {
                throw new Error('/404');
            }
            if (response.status === 403 || response.status === 401) {
                throw new Error(response.data.message);
            }
            return response.data;
        }).then((data) => {
            dispatch(authnAction.login(data))
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                dispatch(authnAction.logout())
                navigate('/admin/signin')
            }
        })
    }

    useEffect(() => {
        if (isAuthn) {
            getRoomsChat();
            setIsLoadingRoomsChat(false);
        } else {
            checkIsLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div style={{
            height: isAdmin ? "92vh" : "100vh",
        }} className={`${styles['chat']} d-flex flex-column  p-4 `}>
            <div className={`${styles['header-chat']} justify-content-between d-flex h-fit-content`}>
                <div>
                    <h4>Chat</h4>
                    <p>apps / chat</p>
                </div>
                <div className='d-flex justify-content-end align-items-center h-100'>
                    <div className='d-flex h-100 align-items-center'>
                        <div className={`me-1`}>
                            <p className={`m-0 ${styles['full-name']} text-end`}>{fullName}</p>
                            <p className={`m-0 ${styles['email']}`}>{email}</p>
                        </div>
                        <div className='h-50 '>
                            <img className={`h-100 ${styles['avatar']}`} src={avatar} alt="" />
                        </div>
                    </div>
                    <button className={`ms-3 ${styles['logout']}`}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={`${styles['icon']} f-1`} />
                        Logout
                    </button>
                </div>
            </div>
            <div className={`${styles['body-chat']} w-100 d-flex`}>
                <div className='f-1 h-100 overflow-auto'>
                    {
                        isLoadingRoomsChat ? <LoadingSpinner /> : <ChatListUser socket={socket} setRoomId={setRoomId} roomsChat={roomsChat} setRoomsChat={setRoomsChat} setUser={setUser} setIsLoading={setIsLoading} />

                    }
                </div>
                <div className='f-4 h-100'>
                    <div className={`${styles['wrapper-message']}`}>
                        {
                            isLoading ? <LoadingSpinner /> : (
                                roomId ? <>
                                    <ChatMessage destroyRoomChat={destroyRoomChat} user={user} messages={messages} />
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