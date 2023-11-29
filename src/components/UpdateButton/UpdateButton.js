import React from 'react';
import styles from './UpdateButton.module.css';
import { Link } from 'react-router-dom';

function UpdateButton({ onclick }) {
    return (
        <Link onClick={onclick} className={`${styles['update-button']} text-white text-decoration-none px-2 py-1`}>
            update
        </Link>
    );
}

export default UpdateButton;