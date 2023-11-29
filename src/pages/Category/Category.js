import React, { useEffect, useState } from 'react';
import styles from './Category.module.css'
import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTags } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import UpdateButton from '../../components/UpdateButton/UpdateButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { getCategoriesAdminApi } from '../../apis/category';

function Category() {
    const { token } = useSelector(state => state.authn)
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1)
    const loadAreas = () => {
        getCategoriesAdminApi(token, page).then((response) => {
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
            return response.data
        }).then((data) => {
            setTotalPage(data.total_pages);
            setCategories(data.results)
        }).catch((error) => {
            console.log(error)
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                navigate('/login')
            }
        })
        // getAreasAdminApi(token, page).then((response) => {
        //     if (response.status === 403 || response.status === 401) {
        //         // localStorage.removeItem('bookingAdminToken');
        //         // window.location.href = '/admin/login'
        //     }
        //     if (response.status !== 200) {
        //         throw new Error('Something wrong');
        //     }
        //     return response.data;
        // }).then((data) => {
        //     setTotalPage(data.total_pages);
        //     setAreas(data.results)
        // }).catch((error) => {
        //     console.log(error)
        //     alert(error.message)
        // })
    }

    useEffect(() => {
        loadAreas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])


    const deleteArea = (id) => {
        // deleteAreaAdminApi(token, id).then((response) => {
        //     if (response.status === 403 || response.status === 401) {
        //         localStorage.removeItem('bookingAdminToken');
        //         window.location.href = '/admin/login'
        //     }
        //     if (response.status !== 200) {
        //         throw new Error(response.data.message);
        //     }
        // }).then(() => {
        //     let tmpAreas = areas;
        //     const position = tmpAreas.findIndex((area) => {
        //         return id === area._id;
        //     })
        //     tmpAreas.splice(position, 1);
        //     setAreas([...tmpAreas])
        //     alert('Successfully!')
        // }).catch((error) => {
        //     loadAreas();
        //     console.log(error)
        //     alert(error.message)
        // })
    }
    const renderCategories = (categories) => {
        return categories.map((category, index) => {
            if (index % 2 === 0) {
                return <div className={`${styles['body-row']} d-flex`}>
                    <div className={`${styles['id']} f-4  ps-3 text-ellipsis`}>{category._id}</div>
                    <div className={`${styles['name']} f-4 text-capitalize ps-3 text-ellipsis`}>{category.name}</div>
                    <div className={`${styles['image']} f-2 text-uppercase ps-3`}>
                        <img className="w-50" alt={category.name} src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${category.image}`} />
                    </div>
                    <div className='f-2 text-capitalize ps-3'>
                        <UpdateButton />
                        <DeleteButton className="ms-1" />
                    </div>
                </div>
            } else {
                return <div className={`${styles['body-row']} d-flex bg-row-even`}>
                    <div className={`${styles['id']} f-4  ps-3 text-ellipsis`}>{category._id}</div>
                    <div className={`${styles['name']} f-4 text-capitalize ps-3 text-ellipsis`}>{category.name}</div>
                    <div className={`${styles['image']} f-2 text-uppercase ps-3`}>
                        <img className="w-50" alt={category.name} src={category.image} />
                    </div>
                    <div className='f-2 text-capitalize ps-3'>
                        <UpdateButton />
                        <DeleteButton className="ms-1" />
                    </div>
                </div>
            }
        })
    }

    return (
        <div>

            <Card>
                <div className='px-4 pb-3'>
                    <div className='d-flex justify-content-between py-2 align-items-center'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Products</h3>
                        <Link to="/admin/category/add" className={`${styles['btn-add_area']} text-decoration-none`}>Add new </Link>
                    </div>
                    <div className={`${styles['table']}`}>
                        <div className={`${styles['header-table']}`}>
                            <div className={`${styles['header-row']} d-flex`}>
                                <div className='f-4 text-uppercase ps-3 text-ellipsis'>id</div>
                                <div className='f-4 text-capitalize ps-3 text-ellipsis'>name</div>
                                <div className='f-2 text-capitalize ps-3'>image</div>
                                <div className='f-2 text-capitalize ps-3'>Edit</div>
                            </div>
                        </div>
                        <div className={`${styles['body-table']}`}>
                            {renderCategories(categories)}
                        </div>
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

export default Category;