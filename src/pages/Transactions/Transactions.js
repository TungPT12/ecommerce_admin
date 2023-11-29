import React, { useCallback, useEffect, useState } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './Transactions.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'react-bootstrap';
import TagTransaction from '../../components/TagTransaction/TagTransaction';
import { getAllTransactionAdminApi } from '../../apis/transaction';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

function Transactions() {
    const { token } = useSelector(state => state.authn)
    const [transactions, setTransactions] = useState([]);
    const [totalPage, setTotalPage] = useState(1)
    const [page, setPage] = useState(1)
    const loadTransactions = () => {
        getAllTransactionAdminApi(token, page).then((response) => {
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
            setTransactions(data.results)
        }).catch((error) => {
            alert(error.message);
            console.log(error)
        })
    }

    const renderRoomNumber = useCallback((roomNumbers) => {
        return roomNumbers.map((roomNumber, index) => {
            if (index === roomNumbers.length - 1) {
                return roomNumber;
            }
            return roomNumber + ', '
        })
    }, [])

    const renderTransactions = (transactions) => {
        return transactions.map((transaction) => {
            return <tr key={transaction._id} className='w-100'>
                <td className='f-1 text-center'>
                    <input type="checkbox" />
                </td>
                <td className='f-5 ps-3'>{transaction._id}</td>
                <td className='f-4 ps-3'>{transaction.userId.username}</td>
                <td className='f-4 ps-3'>{transaction.hotelId.name}</td>
                <td className='f-3 ps-3'>{renderRoomNumber(transaction.rooms)}</td>
                <td className='f-4 ps-3'>{format(new Date(transaction.dateStart), 'dd/MM/yyyy')} - {format(new Date(transaction.dateEnd), 'dd/MM/yyyy')}</td>
                <td className='f-2 ps-2'>${transaction.price}</td>
                <td className='f-3 ps-3'>{transaction.payment}</td>
                <td className='f-2 ps-3'>
                    <TagTransaction
                        title={transaction.status}
                    />
                </td>
            </tr>
        })
    }

    useEffect(() => {
        loadTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    return (
        <Card>
            <div className='px-2'>
                <div className='d-flex justify-content-between py-2 align-items-center'>
                    <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>transactions list</h3>
                </div>
                <div className={`${styles['transactions']}`}>
                    <table className={`${styles['table']} w-100`}>
                        <thead className='w-100 bg-light'>
                            <tr className='w-100'>
                                <th className='f-1'>
                                    <span className='d-flex justify-content-center'>
                                        <input type="checkbox" />
                                    </span>
                                </th>
                                <th className='f-5 text-uppercase ps-3'>
                                    <span>id</span>
                                </th>
                                <th className='f-4 text-capitalize ps-3'>
                                    <span className='pe-5'>user</span>
                                </th>
                                <th className='f-4 text-capitalize ps-3'>
                                    <span>hotel</span>
                                </th>
                                <th className='f-3 text-capitalize ps-3'>
                                    <span>room</span>
                                </th>
                                <th className='f-4 ps-2 text-capitalize'>
                                    <span>date</span>
                                </th>
                                <th className='f-2 text-capitalize ps-3'>
                                    <span>price</span>
                                </th>
                                <th className='f-3 text-capitalize ps-2'>
                                    <span className=''>payment method</span>
                                </th>
                                <th className='f-2 text-capitalize ps-3'>
                                    <span>Status</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTransactions(transactions)}
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
    );
}

export default Transactions;