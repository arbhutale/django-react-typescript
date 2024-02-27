import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { invoiceActions } from '../_store';

export { List };

function List() {
    const transactions = useSelector(x => x.invoice.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(invoiceActions.getAll());
    }, []);

    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleOpenModal = (transaction) => {
        setSelectedTransaction(transaction);
    };

    const handleCloseModal = () => {
        setSelectedTransaction(null);
    };

    return (
        <div>
            <h1>Invoices</h1>
            <Link to="add" className="btn btn-sm btn-info mb-2">Add Invoice</Link>
            <div className='table-responsive-sm'>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Invoice User</th>
                        <th style={{ width: '20%' }}>Invoice Category</th>
                        <th style={{ width: '20%' }}>Description</th>
                        <th style={{ width: '20%' }}>Total Amount</th>
                        <th style={{ width: '20%' }}>Invoice Date</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions?.value?.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.invoice_user?.name}</td>
                            <td>{transaction.category?.name}</td>
                            <td>{transaction?.description}</td>
                            <td>{transaction?.total_amount}</td>
                            <td>{new Date(transaction?.invoice_date).toLocaleString()}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button
                                    className="btn btn-sm btn-primary me-1"
                                    onClick={() => handleOpenModal(transaction)}
                                >
                                    View Items
                                </button>
                                <Link to={`edit/${transaction.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                            </td>
                        </tr>
                    ))}
                    {transactions?.loading &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

</div>
            {selectedTransaction && (
                <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Invoice Items</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Tax</th>
                                            <th>Final Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTransaction.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price}</td>
                                                <td>{item.tax}</td>
                                                <td>{item.final_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='float-end me-5 pe-5'>Final Bill: {selectedTransaction.total_amount}</div>
                                <div className='float-start'><a href ={process.env.REACT_APP_API_URL + selectedTransaction.image} target='_blank' rel="noreferrer"> <button className='btn btn-sm btn-info'>View Invoice</button></a></div>
                                {/* <img width="100%" src={process.env.REACT_APP_API_URL + selectedTransaction.image} alt="Invoice Image" /> */}
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
