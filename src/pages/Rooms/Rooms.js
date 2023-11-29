import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './Rooms.module.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { deleteRoomByIdAdminApi, getAllRoomAdminApi } from '../../apis/room';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../components/CofirmModal/ConfirmModal';

function Rooms() {
    const [modalOption, setModalOption] = useState({
        isOpen: false,
        onClick: () => { }
    })
    const { token } = useSelector(state => state.authn)
    const [rooms, setRooms] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1);

    const loadRooms = (token, page) => {
        getAllRoomAdminApi(token, page).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error('Something wrong');
            }
            return response.data;
        }).then((data) => {
            setTotalPage(data.total_pages);
            setRooms(data.results)
        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
    }

    const deleteRoomById = (id) => {
        deleteRoomByIdAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status === 400 || response.status === 404) {
                throw new Error(response.data.message)
            }
            if (response.status !== 200) {
                throw new Error('Something wrong');
            }
        }).then(() => {
            setModalOption({
                isOpen: false,
                onClick: () => { }
            })
            loadRooms(token, page)
            alert("Successfully!")
        }).catch((error) => {
            setModalOption({
                isOpen: false,
                onClick: () => { }
            })
            alert(error.message)
        })
    }

    useEffect(() => {
        loadRooms(token, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const renderRooms = (rooms) => {
        return rooms.map((room) => {
            return <tr key={room._id} className='w-100'>
                <td className='f-1 text-center'>
                    <input type="checkbox" />
                </td>
                <td className='f-3 ps-3'>{room._id}</td>
                <td className='f-3 ps-3 text-capitalize'>{room.title}</td>
                <td className='f-5 ps-3 pe-3'>{room.desc}</td>
                <td className='f-2 ps-1'>{room.price}</td>
                <td className='f-2 ps-3'>{room.maxPeople}</td>
                <td className='f-1 ps-3'>
                    <button onClick={() => {
                        setModalOption({
                            isOpen: true,
                            onClick: () => {
                                deleteRoomById(room._id)
                            }
                        })
                    }} className={`${styles['delete-btn']}`}>Delete</button>
                </td>
                <td className='f-1 ps-3'>
                    <Link to={`/admin/room/edit/${room._id}`} className={`${styles['delete-btn']} px-2 text-decoration-none`}>Edit</Link>
                </td>
            </tr>
        })
    }

    const closeModal = () => {
        setModalOption({
            isOpen: false,
            onClick: () => { }
        })
    }
    return (
        <div>
            <ConfirmModal modalOption={modalOption} closeModal={closeModal} />
            <Card>
                <div className='px-4 pb-3'>
                    <div className='d-flex justify-content-between py-2 align-items-center'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>rooms list</h3>
                        <Link to="/admin/room/add" className={`${styles['btn-add_room']} text-decoration-none`}>Add new </Link>
                    </div>
                    <div className={`${styles['list-room']}`}>
                        <table className={`${styles['table']} w-100`}>
                            <thead className='w-100 bg-light'>
                                <tr className='w-100'>
                                    <th className='f-1'>
                                        <span className='d-flex justify-content-center'>
                                            <input type="checkbox" />
                                        </span>
                                    </th>
                                    <th className='f-3 text-uppercase ps-3'>
                                        <span>id</span>
                                    </th>
                                    <th className='f-3 text-capitalize ps-3'>
                                        <span className='pe-5'>title</span>
                                    </th>
                                    <th className='f-5 text-capitalize ps-3 pe-3'>
                                        <span>description</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-1'>
                                        <span>price</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-3'>
                                        <span>max people</span>
                                    </th>
                                    <th className='f-1 text-capitalize ps-3'>
                                        <span>Action</span>
                                    </th>
                                    <th className='f-1 text-capitalize ps-3'>
                                        <span>Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRooms(rooms)}
                            </tbody>
                        </table>
                        <div className={`${styles['paging']} mt-5 d-flex justify-content-end px-5 py-3`}>
                            <span className='me-4'>{page}-{totalPage} of {totalPage} </span>
                            <div className='d-flex'>
                                <button disabled={page === 1} onClick={() => {
                                    setPage(page - 1)
                                }} className={`${styles['pre-btn']} d-flex justify-content-center align-items-center me-1 outline-none`}>
                                    <FontAwesomeIcon icon={faChevronLeft} className={`${styles['chevron-icon']}  px-3`} />
                                </button>
                                <button disabled={page === totalPage} onClick={() => {
                                    setPage(page + 1)
                                }} className={`${styles['next-btn']} d-flex justify-content-center align-items-center py-1  outline-none`}>
                                    <FontAwesomeIcon icon={faChevronRight} className={`${styles['chevron-icon']} px-3`} />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Rooms;