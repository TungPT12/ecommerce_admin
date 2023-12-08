import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './User.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { disableUserAdminApi, enableUserAdminApi, getAllUserAdminApi, getUsersAdminApi } from '../../apis/user';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { checkIsLoginApi } from '../../apis/authn';
import { authnAction } from '../../stores/slice/authn';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

function Users() {
    const { token, isAuthn } = useSelector(state => state.authn);
    const [users, setUsers] = useState([]);
    const [isLoadingSpinnerModal, setIsLoadingSpinnerModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [totalPage, setTotalPage] = useState(1)
    // const [page, setPage] = useState(1)
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
                dispatch(authnAction.logout());
                throw new Error(response.data.message);
            }
            if (response.status === 422) {
                throw new Error('/422');
            }
            return response.data
        }).then((data) => {
            dispatch(authnAction.login(data))
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/admin/signin')
            }
        })
    }

    const getUsers = () => {
        getUsersAdminApi(token).then((response) => {
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
            setIsLoading(false)
            setUsers(data.results)
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                dispatch(authnAction.logout())
                navigate('/admin/signin')
            }
        })
    }

    // const disableUser = (id) => {
    //     disableUserAdminApi(token, id).then((response) => {
    //         if (response.status === 403 || response.status === 401) {
    //             localStorage.removeItem('bookingAdminToken');
    //             window.location.href = '/admin/login'
    //         }
    //         if (response.status !== 200) {
    //             throw new Error(response.data.message);
    //         }
    //     }).then(() => {
    //         loadUser()
    //         alert('Successfully')
    //     }).catch((error) => {
    //         loadUser();
    //         alert(error.message);
    //         console.log(error)
    //     })
    // }

    // const enableUser = (id) => {
    //     enableUserAdminApi(token, id).then((response) => {
    //         if (response.status === 403 || response.status === 401) {
    //             localStorage.removeItem('bookingAdminToken');
    //             window.location.href = '/admin/login'
    //         }
    //         if (response.status !== 200) {
    //             throw new Error(response.data.message);
    //         }
    //     }).then(() => {
    //         loadUser()
    //         alert('Successfully')
    //     }).catch((error) => {
    //         loadUser();
    //         alert(error.message);
    //         console.log(error)
    //     })
    // }

    const renderUsers = (users) => {
        return users.map((user, index) => {
            return <div key={user._id} className={`${styles['body-row']} d-flex ${index % 2 === 0 ? 'bg-row-even' : ''}`}>
                <div className={` f-1 ps-2 text-ellipsis`}>{user.isAdmin ? 'Admin' : user.isCounselor ? 'Counselor' : 'User'}</div>
                <div className={`${styles['id']} f-3 ps-2 text-ellipsis`}>
                    <p className="text-ellipsis m-0">{user._id}</p>
                </div>
                <div className={`${styles['name']} f-3 text-capitalize ps-2 text-break`}>{user.fullName}</div>
                <div className={`${styles['email']} f-3 text-capitalize ps-2 text-break`}>{user.email}</div>
                {/* <div className={`${styles['image']} f-2 text-uppercase ps-2`}>
                                        <img className="w-50" alt={product.name} src={`${product.images[0].includes("http") ? '' : process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${product.images[0]}`} />
                                        <img className="w-50" alt={product.name} src={`${product.images[0].includes("http") ? '' : process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${product.images[0]}`} />
                                    </div> */}
                <div className={`${styles['phone']} f-2 text-lowercase ps-2`}>
                    <p className="text-ellipsis m-0">{user.phoneNumber}</p>
                </div>
                <div className='f-1 text-capitalize ps-2'>
                    <DeleteButton
                        className="ms-1" />
                </div>
            </div>
        })
    }

    useEffect(() => {
        if (!isAuthn) {
            checkIsLogin()
        } else {
            getUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthn]);

    return (
        <div>
            {
                isAuthn ? (
                    isLoading ? <LoadingSpinner /> : <Card>
                        <div className='px-4 pb-3'>
                            <div className='d-flex justify-content-between py-2 align-items-center'>
                                <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Users list</h3>
                                <Link to="/admin/user/add" className={`${styles['btn-add_user']} text-decoration-none`}>Add new </Link>
                            </div>
                            <input placeholder="Enter Search!" className={`${styles['input-search']} mb-2 w-25 ps-1 py-1`} />
                            <div className={`${styles['list-user']}`}>
                                <div className={`${styles['table']}`}>
                                    <div className={`${styles['header-table']}`}>
                                        <div className={`${styles['header-row']} d-flex`}>

                                            <div className='f-1 text-uppercase ps-2 text-ellipsis'>role</div>
                                            <div className='f-3 text-uppercase ps-2 text-ellipsis'>id</div>
                                            <div className='f-3 text-capitalize ps-2 text-ellipsis'>full name</div>
                                            <div className='f-3 text-capitalize ps-2 text-ellipsis'>email</div>
                                            <div className='f-2 text-capitalize ps-2 text-ellipsis'>phone</div>
                                            <div className='f-1 text-capitalize ps-2'>Edit</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['body-table']}`}>
                                        {renderUsers(users)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : <></>
            }
        </div>
    );
}

export default Users;