import React, { useEffect, useState } from 'react';
import styles from './Type.module.css'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { deleteTypeAdminApi, getTypesAdminApi } from '../../apis/type';
import { useSelector } from 'react-redux';

function Type() {
    const { token } = useSelector(state => state.authn)
    const [types, setTypes] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const loadTypes = () => {
        getTypesAdminApi(token, page).then((response) => {
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
            setTypes(data.results)
        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
    }


    const deleteType = (id) => {
        deleteTypeAdminApi(token, id).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
            }
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
        }).then(() => {
            let tmpTypes = types;
            const position = tmpTypes.findIndex((type) => {
                return id === type._id;
            })
            tmpTypes.splice(position, 1);
            setTypes([...tmpTypes])
            alert('Successfully!')
        }).catch((error) => {
            loadTypes();
            alert(error.message);
            console.log(error)
        })
    }


    useEffect(() => {
        loadTypes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const renderTypes = (types) => {
        return types.map((type) => {
            return <tr className='w-100'>
                <td className='f-1 text-center'>
                    <input type="checkbox" />
                </td>
                <td className='f-3 ps-3'>{type._id}</td>
                <td className='f-3 ps-3 text-capitalize'>{type.name}</td>
                <td className='f-3 ps-3 text-capitalize'>
                    <img className="w-25" alt={type.name} src={type.image} />
                </td>
                <td className='f-1 ps-3'>
                    <button onClick={() => {
                        deleteType(type._id)
                    }} className={`${styles['delete-btn']}`}>Delete</button>
                </td>
                <td className='f-1 ps-3'>
                    <Link to={`/admin/type/edit/${type._id}`} className={`${styles['delete-btn']} text-decoration-none px-2`}>Edit</Link>
                </td>
            </tr>
        })
    }

    return (
        <div>
            <Card>
                <div className='px-4 pb-3'>
                    <div className='d-flex justify-content-between py-2 align-items-center'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>areas list</h3>
                        <Link to="/admin/type/add" className={`${styles['btn-add_area']} text-decoration-none`}>Add new </Link>
                    </div>
                    <div className={`${styles['list-area']}`}>
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
                                        <span className='pe-5'>name</span>
                                    </th>
                                    <th className='f-3 text-capitalize ps-3 pe-3'>
                                        <span>image</span>
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
                                {renderTypes(types)}
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

export default Type;