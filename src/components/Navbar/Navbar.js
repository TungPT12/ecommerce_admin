import { faBox, faUser, faCartShopping, faMessage, faDashboard, faArrowRightFromBracket, faTags } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authnAction } from '../../stores/slice/authn';

function Navbar() {
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(authnAction.logout())
        window.location.href = '/admin/login'
    }

    return (
        <div className={`${styles['navbar']} f-1 h-100`}>
            <div className="ms-2">
                <p className={`${styles['navbar-title']} text-uppercase mb-2 mt-3`}>Main</p>
                <NavLink to="/admin/dashboard" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faDashboard} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>dashboard</span>
                </NavLink>
            </div>
            <div className="ms-2">
                <p className={`${styles['navbar-title']} text-uppercase mb-2 mt-3`}>list</p>
                <NavLink to="/admin/category" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center mb-2`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faTags} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>Category</span>
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center mb-2`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faBox} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>Products</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center mb-2`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faUser} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>users</span>
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center mb-2`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faCartShopping} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>Order</span>
                </NavLink>
                <NavLink to="/admin/transactions" className={({ isActive }) => {
                    let defaultClass = `py-1 d-flex text-decoration-none align-items-center mb-2`;
                    return isActive ? `${defaultClass} ${styles['isACtiveTab']}` : defaultClass
                }}>
                    <FontAwesomeIcon icon={faMessage} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5`}>Chat</span>
                </NavLink>
            </div>
            <div className="ms-2">
                <p className={`${styles['navbar-title']} text-uppercase mb-2 mt-3`}>list</p>
                <button to="/admin/users" onClick={logout} className={`${styles['logout-btn']} py-1 d-flex text-decoration-none align-items-center border-0 w-100`}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className={`${styles['icon']} f-1`} />
                    <span className={`${styles['tab-name']} text-capitalize f-5 text-start`}>Logout</span>
                </button>
            </div>
        </div >
    );
}

export default Navbar;



