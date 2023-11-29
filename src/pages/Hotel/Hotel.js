import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './Hotel.module.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { deleteHotelByIdAdminApi, getAllHotelAdminApi } from '../../apis/hotel';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../components/CofirmModal/ConfirmModal';

function Hotel() {
    const { token } = useSelector(state => state.authn)
    const [modalOption, setModalOption] = useState({
        isOpen: false,
        onClick: () => { }
    })
    const [hotels, setHotels] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1);
    const loadHotel = () => {
        getAllHotelAdminApi(token, page).then((response) => {
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
            setHotels(data.results)
        }).catch((error) => {
            console.log(error)
            alert(error.message);
        })
    }
    useEffect(() => {
        loadHotel()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    // const disableHotel = (id) => {
    //     disableHotelAdminApi(token, id).then((response) => {
    //         if (response.status === 403 || response.status === 401) {
    //             localStorage.removeItem('bookingAdminToken');
    //             window.location.href = '/admin/login'
    //         }

    //         if (response.status !== 200) {
    //             throw new Error(response.data.message);
    //         }
    //     }).then(() => {
    //         loadHotel()
    //         alert("successfully!")
    //     }).catch((error) => {
    //         loadHotel();
    //         console.log(error)
    //         alert(error.message);
    //     })
    // }

    const deleteHotels = (id) => {
        deleteHotelByIdAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status === 400) {
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
            loadHotel()
            alert("Successfully!")
        }).catch((error) => {
            setModalOption({
                isOpen: false,
                onClick: () => { }
            })
            alert(error.message)
        })
    }

    const closeModal = () => {
        setModalOption({
            isOpen: false,
            onClick: () => { }
        })
    }

    const renderHotels = (hotels) => {
        return hotels.map((hotel) => {
            return <tr key={hotel._id} className='w-100'>
                <td className='f-1 text-center'>
                    <input type="checkbox" />
                </td>
                <td className='f-4 ps-3'>{hotel._id}</td>
                <td className='f-5 ps-3'>{hotel.name}</td>
                <td className='f-2 ps-3'>{hotel.type.name}</td>
                <td className='f-4 ps-1'>{hotel.title}</td>
                <td className='f-2 ps-3'>{hotel.area.name}</td>
                <td className='f-1 ps-3'>
                    <button onClick={() => {
                        setModalOption({
                            isOpen: true,
                            onClick: () => {
                                deleteHotels(hotel._id)
                            }
                        })
                    }} className={`${styles['delete-btn']}`}>Delete</button>
                </td>
                <td className='f-1 ps-3'>
                    <Link to={`/admin/hotel/edit/${hotel._id}`} className={`${styles['delete-btn']} text-decoration-none px-2`}>Edit</Link>
                </td>
            </tr>
        })
    }

    return (
        <div>
            <ConfirmModal modalOption={modalOption} closeModal={closeModal} />
            <Card>
                <div className='px-4 pb-3'>
                    <div className='d-flex justify-content-between py-2 align-items-center'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>hotels list</h3>
                        <Link to="/admin/hotel/add" className={`${styles['btn-add_hotel']} text-decoration-none`}>Add new </Link>
                    </div>
                    <div className={`${styles['list-hotel']}`}>
                        <table className={`${styles['table']} w-100`}>
                            <thead className='w-100 bg-light'>
                                <tr className='w-100'>
                                    <th className='f-1'>
                                        <span className='d-flex justify-content-center'>
                                            <input type="checkbox" />
                                        </span>
                                    </th>
                                    <th className='f-4 text-uppercase ps-3'>
                                        <span>id</span>
                                    </th>
                                    <th className='f-5 text-capitalize ps-3'>
                                        <span className='pe-5'>name</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-3'>
                                        <span>type</span>
                                    </th>
                                    <th className='f-4 text-capitalize ps-1'>
                                        <span>title</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-3'>
                                        <span>area</span>
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
                                {renderHotels(hotels)}
                            </tbody>
                        </table>
                        <div className={`${styles['paging']} mt-5 d-flex justify-content-end px-5 py-3`}>
                            <span className='me-4'>{page}-{totalPage} of {totalPage}</span>
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

export default Hotel;