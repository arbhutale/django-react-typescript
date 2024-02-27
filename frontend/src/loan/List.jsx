import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { loanActions } from '../_store';

export { List };

function List() {
    const loans = useSelector(x => x.loans.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loanActions.getAll());
    }, []);

    return (
        <div>
            <h1>Loans</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add Loan</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Frequency</th>
                        <th>Username</th>
                        <th>Bank</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Intrest Rate</th>
                        <th>Loan Type</th>
                        <th>Tenure</th>
                    </tr>
                </thead>
                <tbody>
              
                {loans?.value?.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.amount}</td>
                            <td>{transaction.emi_frequency}</td>
                            <td>{transaction.bank}</td>
                            <td>{transaction.emi_start_date}</td>
                            <td>{transaction.emi_end_date}</td>
                            <td>{transaction.interest_rate}</td>
                            <td>{transaction.loan_type}</td>
                            <td>{transaction.tenure_months}</td>
                            {/* Other columns go here */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${transaction.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                {/* Delete button */}
                            </td>
                        </tr>
                    ))}
                    {loans?.loading &&
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
