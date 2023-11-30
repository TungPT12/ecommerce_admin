import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import styles from './Product.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../../components/CofirmModal/ConfirmModal';
import UpdateButton from '../../components/UpdateButton/UpdateButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import LoadingSpinnerModal from '../../components/LoadingSpinnerModal/LoadingSpinnerModal';
import { getProductsAdminApi } from '../../apis/product';
import { authnAction } from '../../stores/slice/authn';
import { checkIsLoginApi } from '../../apis/authn';
import formatPrice from '../../utils/FormatPrice';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

function Product() {
    const { token, isAuthn } = useSelector(state => state.authn);
    const [isLoadingSpinnerModal, setIsLoadingSpinnerModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOption, setModalOption] = useState({
        isOpen: false,
        onClick: () => { }
    })
    const [products, setProducts] = useState([]);

    const loadProducts = () => {
        getProductsAdminApi(token).then((response) => {
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
            setProducts(data.results)
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

    // const deleteHotels = (id) => {
    //     deleteHotelByIdAdminApi(token, id).then((response) => {
    //         if (response.status === 403 || response.status === 401) {
    //             localStorage.removeItem('bookingAdminToken');
    //             window.location.href = '/admin/login'
    //         }
    //         if (response.status === 400) {
    //             throw new Error(response.data.message)
    //         }
    //         if (response.status !== 200) {
    //             throw new Error('Something wrong');
    //         }
    //     }).then(() => {
    //         setModalOption({
    //             isOpen: false,
    //             onClick: () => { }
    //         })
    //         loadHotel()
    //         alert("Successfully!")
    //     }).catch((error) => {
    //         setModalOption({
    //             isOpen: false,
    //             onClick: () => { }
    //         })
    //         alert(error.message)
    //     })
    // }

    const closeModal = () => {
        setModalOption({
            isOpen: false,
            onClick: () => { }
        })
    }

    useEffect(() => {
        if (!isAuthn) {
            checkIsLogin()
        } else {
            loadProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthn]);

    const renderProducts = (products) => {
        return products.map((product, index) => {
            return <div key={product._id} className={`${styles['body-row']} d-flex ${index % 2 === 0 ? 'bg-row-even' : ''}`}>
                <div className={`${styles['id']} f-3 ps-2 text-ellipsis`}>
                    <p className="text-ellipsis m-0">{product._id}</p>
                </div>
                <div className={`${styles['name']} f-4 text-capitalize ps-2 text-ellipsis`}>
                    <p className="text-ellipsis m-0">{product.name}</p>
                </div>
                <div className={`${styles['price']} f-2 text-capitalize ps-2 text-ellipsis`}>{formatPrice(product.price)}</div>
                <div className={`${styles['image']} f-2 text-uppercase ps-2`}>
                    {/* <img className="w-50" alt={product.name} src={`${process.env.REACT_APP_API_ENDPOINT_URL_IMAGE}${product.images[0]}`} /> */}
                    <img className="w-50" alt={product.name} src={`${product.images[0]}`} />
                </div>
                <div className={`${styles['category']} f-2 text-lowercase ps-2`}>
                    <p className="text-ellipsis m-0">{product.category.name}</p>
                </div>
                <div className='f-2 text-capitalize ps-2'>
                    <UpdateButton
                        link={`/admin/product/edit/${product._id}`}
                    />
                    <DeleteButton
                        onclick={() => {
                            setIsLoadingSpinnerModal(true);
                            setModalOption({
                                isOpen: true,
                                onClick: () => {
                                    // deleteHotels(hotel._id)
                                }
                            })
                        }}
                        className="ms-1" />
                </div>
            </div>
        })
    }

    return (
        <div>
            {
                isAuthn ? (
                    isLoading ? <LoadingSpinner /> : <>
                        <ConfirmModal modalOption={modalOption} closeModal={closeModal} />
                        <Card>
                            <div className='px-4 pb-3'>
                                <div className='d-flex justify-content-between py-2 align-items-center'>
                                    <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>Products list</h3>
                                    <Link to="/admin/product/add" className={`${styles['btn-add_hotel']} text-decoration-none`}>Add new </Link>
                                </div>
                                <input placeholder="Enter Search!" className={`${styles['input-search-product']} mb-2 w-25 ps-1 py-1`} />
                                <div className={`${styles['table']}`}>
                                    <div className={`${styles['header-table']}`}>
                                        <div className={`${styles['header-row']} d-flex`}>
                                            <div className='f-3 text-uppercase ps-2 text-ellipsis'>id</div>
                                            <div className='f-4 text-capitalize ps-2 text-ellipsis'>name</div>
                                            <div className='f-2 text-capitalize ps-2 text-ellipsis'>price</div>
                                            <div className='f-2 text-capitalize ps-2'>image</div>
                                            <div className='f-2 text-capitalize ps-2 text-ellipsis text-lowercase'>category</div>
                                            <div className='f-2 text-capitalize ps-2'>Edit</div>
                                        </div>
                                    </div>
                                    <div className={`${styles['body-table']}`}>
                                        {renderProducts(products)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </>
                ) : <></>
            }
        </div>
    );
}

export default Product;