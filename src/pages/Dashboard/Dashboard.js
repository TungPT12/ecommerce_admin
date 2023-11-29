import React, { useCallback, useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import InfoBoard from '../../components/InfoBorad/InfoBoard';
import { faUser, faCartShopping, faDollar, faWallet } from '@fortawesome/free-solid-svg-icons';
import styles from './Dashboard.module.css'
import TagTransaction from '../../components/TagTransaction/TagTransaction';
import { getBalanceAdminApi, getFirstEightTransactionAdminApi, getTransactionCount } from '../../apis/transaction';
import { format } from 'date-fns';
import { getUserCountAdminApi } from '../../apis/user';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatPrice from '../../utils/FormatPrice';

function Dashboard() {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.authn)
    const [transactions, setTransactions] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [earning, setEarning] = useState(0);
    const loadFirstEightTransactions = () => {
        getFirstEightTransactionAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                navigate('/admin/login')
                return
            }
            if (response.status !== 200) {
                throw new Error('Something wrong');
            }
            return response.data;
        }).then((data) => {
            setTransactions(data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const loadTransactionCount = () => {
        getTransactionCount(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
                return
            }
            if (response.status !== 200) {
                throw new Error('Something wrong');
            }
            return response.data;
        }).then((data) => {
            setTransactionCount(data.totalTransaction)
        }).catch((error) => {
            console.log(error)
        })
    }

    const loadUserCount = () => {
        getUserCountAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
                return
            }
            if (response.status !== 200) {
                throw new Error('Something wrong');
            }
            return response.data;
        }).then((data) => {
            setUserCount(data.totalUser)
        }).catch((error) => {
            console.log(error)
        })
    };

    const getBalance = (token) => {
        getBalanceAdminApi(token).then((response) => {
            if (response.status === 403 || response.status === 401) {
                localStorage.removeItem('bookingAdminToken');
                window.location.href = '/admin/login'
                return;
            };
            if (response.status !== 200) {
                throw new Error('Something wrong');
            };
            return response.data;
        }).then((data) => {
            setBalance(data.balance)
            setEarning(data.balance)
        }).catch((error) => {
            console.log(error)
        });
    };

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
                <td className='f-3 ps-3'>{transaction.userId.username}</td>
                <td className='f-5 ps-3'>{transaction.hotelId.name}</td>
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
        loadFirstEightTransactions();
        loadTransactionCount();
        loadUserCount();
        getBalance(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <div className={`d-flex gap-2`}>
                <InfoBoard
                    title="users"
                    statistical={0}
                    styleIcon='icon-user'
                    icon={faUser}
                />
                <InfoBoard
                    title="transactions"
                    statistical={0}
                    styleIcon='icon-order'
                    icon={faCartShopping}
                />
                <InfoBoard
                    title="earnings"
                    statistical={`$ 0`}
                    styleIcon='icon-earning'
                    icon={faDollar}
                />
                <InfoBoard
                    title="balances"
                    statistical={`$ 0`}
                    styleIcon='icon-balance'
                    icon={faWallet}
                />
            </div>
            <div className='mt-2'>
                <Card>
                    <div className='px-2'>
                        <h3 className={`${styles['title']} pe-3 pt-3 pb-2 mb-0 text-capitalize`}>last transactions</h3>
                        <div className={`${styles['dashboard-transactions']}`}>
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
                                        <th className='f-3 text-capitalize ps-3'>
                                            <span className='pe-5'>user</span>
                                        </th>
                                        <th className='f-5 text-capitalize ps-3'>
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
                                    <tr className='w-100'>
                                        <td className='f-1 text-center'>
                                            <input type="checkbox" />
                                        </td>
                                        <td className='f-5 ps-3'>{ }</td>
                                        <td className='f-3 ps-3'>{ }</td>
                                        <td className='f-5 ps-3'>{ }</td>
                                        <td className='f-3 ps-3'>{ }</td>
                                        <td className='f-4 ps-3'>{ }</td>
                                        <td className='f-2 ps-2'>${ }</td>
                                        <td className='f-3 ps-3'>{ }</td>
                                        <td className='f-2 ps-3'>
                                            {/* <TagTransaction
                                            title={transaction.status}
                                        /> */}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <div className={`${styles['paging']} mt-5 d-flex justify-content-end px-5 py-3`}>
                                <span className='me-4'>1-8 of 8 </span>
                                <div className=''>
                                    <FontAwesomeIcon icon={faChevronLeft} className={`${styles['chevron-icon']}  pe-3`} />
                                    <FontAwesomeIcon icon={faChevronRight} className={`${styles['chevron-icon']}`} />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </Card>
            </div >
        </div >
    );
}

export default Dashboard;