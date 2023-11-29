import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './MainPage.module.css'
import { useSelector } from 'react-redux';

function MainPage({ children }) {
    const { isAuthn } = useSelector((state) => state.authn)
    return (
        <div className={`${styles['main-page']} d-flex`}>
            {isAuthn ? <Navbar /> : <></>}
            <div className={`${styles['tab-main-page']}  f-5`}>
                <div className='ps-2 pt-2'>
                    {isAuthn ? children : <></>}
                    {/* {child  ren} */}
                </div>
            </div>
        </div>
    );
}

export default MainPage;