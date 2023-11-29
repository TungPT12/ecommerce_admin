import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './User.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { disableUserAdminApi, enableUserAdminApi, getAllUserAdminApi } from '../../apis/user';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Users() {
    const [users, setUsers] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1)
    const { token } = useSelector(state => state.authn)
    const loadUser = () => {
        getAllUserAdminApi(token, { page: page }).then((response) => {
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
            setUsers(data.results)
        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
    }

    const disableUser = (id) => {
        disableUserAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
        }).then(() => {
            loadUser()
            alert('Successfully')
        }).catch((error) => {
            loadUser();
            alert(error.message);
            console.log(error)
        })
    }

    const enableUser = (id) => {
        enableUserAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
        }).then(() => {
            loadUser()
            alert('Successfully')
        }).catch((error) => {
            loadUser();
            alert(error.message);
            console.log(error)
        })
    }

    useEffect(() => {
        getAllUserAdminApi(token, { page: page }).then((response) => {
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
            setUsers(data.results)
        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
    }, [page])

    const renderUsers = (users) => {
        return users.map((user) => {
            return <tr key={user._id} className='w-100'>
                <td className='f-1 text-center'>
                    {user.isAdmin ? 'Admin' : 'User'}
                </td>
                <td className='f-3 ps-3'>{user._id}</td>
                <td className='f-3 ps-3 text-capitalize'>{user.fullName}</td>
                <td className='f-2 ps-3 pe-3'>{user.username}</td>
                <td className='f-2 ps-1'>{user.password}</td>
                <td className='f-3 ps-3'>{user.email}</td>
                <td className='f-1 ps-3'>
                    <button onClick={() => {
                        user.isDisable ? enableUser(user._id) : disableUser(user._id)
                    }} className={`${styles['disable-btn']}`}>{user.isDisable ? 'Enable' : 'Disable'}</button>
                </td>
            </tr>
        })
    }

    return (
        <div>
            <Card>
                <div className='px-4 pb-3'>
                    <div className='d-flex justify-content-between py-2 align-items-center'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Users list</h3>
                        <Link to="/admin/user/add" className={`${styles['btn-add_user']} text-decoration-none`}>Add new </Link>
                    </div>
                    <div className={`${styles['list-user']}`}>
                        <table className={`${styles['table']} w-100`}>
                            <thead className='w-100 bg-light'>
                                <tr className='w-100'>
                                    <th className='f-1 text-capitalize'>
                                        <span className='d-flex justify-content-center'>
                                            role
                                        </span>
                                    </th>
                                    <th className='f-3 text-uppercase ps-3'>
                                        <span>id</span>
                                    </th>
                                    <th className='f-3 text-capitalize ps-3'>
                                        <span className='pe-5'>Full Name</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-3 pe-3'>
                                        <span>User name</span>
                                    </th>
                                    <th className='f-2 text-capitalize ps-1'>
                                        <span>password</span>
                                    </th>
                                    <th className='f-3 text-capitalize ps-3'>
                                        <span>Email</span>
                                    </th>
                                    <th className='f-1 text-capitalize ps-3'>
                                        <span>Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderUsers(users)}
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

export default Users;