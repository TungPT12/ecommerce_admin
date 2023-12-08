import React, { useEffect, useState } from 'react';
import styles from './Category.module.css'
import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import ButtonLink from '../../components/ButtonLink/ButtonLink';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { deleteCategoryAdminApi, getCategoriesAdminApi } from '../../apis/category';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { authnAction } from '../../stores/slice/authn';
import { checkIsLoginApi } from '../../apis/authn';
import LoadingSpinnerModal from '../../components/LoadingSpinnerModal/LoadingSpinnerModal';

function Category() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, isAuthn } = useSelector(state => state.authn);
    const [categories, setCategories] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingSpinnerModal, setIsLoadingSpinnerModal] = useState(false);
    const [page, setPage] = useState(1)
    const loadCategories = () => {
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
            setIsLoading(false)
            setTotalPage(data.total_pages);
            setCategories(data.results)
        }).catch((error) => {
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else {
                dispatch(authnAction.logout())
                navigate('/admin/signin')
            }
        })
    }


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


    useEffect(() => {
        if (!isAuthn) {
            checkIsLogin()
        } else {
            loadCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthn, page]);


    const deleteCategory = (id) => {
        deleteCategoryAdminApi(token, id).then((response) => {
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
        }).then(() => {
            let tmpCategories = categories;
            const position = tmpCategories.findIndex((category) => {
                return id === category._id;
            })
            tmpCategories.splice(position, 1);
            setCategories([...tmpCategories])
            setIsLoadingSpinnerModal(false);
        }).catch((error) => {
            loadCategories();
            setIsLoadingSpinnerModal(false);
            if (error.message === '/500' || error.message === '/400' || error.message === '/404') {
                navigate(error.message)
            } else if (error.message === '/422') {
                alert('This category have products!')
            } else {
                navigate('/admin/signin')
            }
        })
    }
    const renderCategories = (categories) => {
        return categories.map((category, index) => {
            return <div key={category._id} className={`${styles['body-row']}  ${index % 2 === 0 ? 'bg-row-even' : ''} d-flex`}>
                <div className={`${styles['id']} f-3  ps-3 text-ellipsis`}>
                    <p className="text-ellipsis m-0">{category._id}</p>
                </div>
                <div className={`${styles['name']} f-3 text-capitalize ps-3 text-ellipsis`}>{category.name}</div>
                <div className={`${styles['image']} f-2 text-uppercase ps-3`}>
                    <img className="w-50" alt={category.name} src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${category.image}`} />
                </div>
                <div className='f-2 text-capitalize ps-3'>
                    <ButtonLink
                        link={`/admin/category/edit/${category._id}`}
                        title="update"
                    />
                    <DeleteButton
                        className="ms-1"
                        onclick={() => {
                            setIsLoadingSpinnerModal(true);
                            deleteCategory(category._id)
                        }}
                    />
                </div>
            </div>
        })
    }

    return (
        <div>
            {
                isLoadingSpinnerModal ? <LoadingSpinnerModal /> : <></>
            }
            {
                isAuthn ? (isLoading ? <LoadingSpinner /> : <Card>
                    <div className='px-4 pb-3'>
                        <div className='d-flex justify-content-between py-2 align-items-center'>
                            <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Products</h3>
                            <Link to="/admin/category/add" className={`${styles['btn-add_category']} text-decoration-none`}>Add new </Link>
                        </div>
                        <div className={`${styles['table']}`}>
                            <div className={`${styles['header-table']}`}>
                                <div className={`${styles['header-row']} d-flex`}>
                                    <div className='f-3 text-uppercase ps-3 text-ellipsis'>id</div>
                                    <div className='f-3 text-capitalize ps-3 text-ellipsis'>name</div>
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
                </Card >) : <></>
            }
        </div>
    );
}

export default Category;