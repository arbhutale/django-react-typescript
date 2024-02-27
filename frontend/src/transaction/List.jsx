import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { transactionActions } from '../_store';

export { List };

function List() {
    const transactions = useSelector(x => x.transactions.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(transactionActions.getAll());
    },[]);

    return (
        <div>

            <h1>Transaction</h1>
            <Link to="add" className="btn btn-sm btn-info mb-2">Add Transaction</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>Transaction Type</th>
                        <th style={{ width: '10%' }}>Transaction Method</th>
                        <th style={{ width: '10%' }}>Transaction Amount</th>
                        <th style={{ width: '10%' }}>Transaction Date</th>
                        <th style={{ width: '10%' }}>Description</th>
                        <th style={{ width: '10%' }}>Transaction Source</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>


                    {transactions?.value?.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.transaction_method}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.transaction_date}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.transaction_source_name}</td>
                            {/* Other columns go here */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${transaction.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                {/* Delete button */}
                            </td>
                        </tr>
                    ))}
                    {transactions?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
