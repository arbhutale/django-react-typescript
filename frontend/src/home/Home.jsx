import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { userActions, alertActions, bankActions } from '../_store';

export { Home };

function Home() {
    const [user, setUser] = useState(null); // Initialize user state with null
    const [bankData, setBankData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const newUser = await dispatch(userActions.getById()).unwrap();

                if (newUser !== user) { // Check if the user has changed
                    setUser(newUser);
                }
                dispatch(bankActions.getAll()).unwrap()
                    .then(data => setBankData(data))

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();

    }, [dispatch]); // Add dispatch as a dependency

    return (
        <div>
            {/* <h1>Hi {user?.first_name}!</h1> */}
            <h6>Welcome <span style={{ textTransform: 'capitalize' }}>{user?.first_name} </span>to ARB Bugdet Book</h6>
            <hr />
            <br />
            <h5 className='pb-3'>List of Banks</h5>
            {bankData.length === 0 &&
                <div className="text-center text-primary m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            <div className='row'>
                {bankData.map((item, index) => (
                    <div className=' col-4'>
                        <div key={index} className="card text-white border-primary m-1">
                            <div className="card-header">{item.bank}  <span className='float-end'>{item.account_type}</span></div>
                            <div className="card-body row">
                                <h6 className="card-title">{item.account_holder_name}  <span className='float-end'>{item.balance}</span></h6>
                                <div className='col-6'>
                                    <p className="card-text ">{item.account_number}</p>
                                </div>
                                <div className='col-6'>
                                    <p className="card-text float-end">{item.ifsc_code}</p>
                                </div>
                                <br/>
                                <br/>
                                <div className='col-6'>
                                     <button className='btn btn-sm btn-warning'>Update</button>
                                </div>
                                <div className='col-6'>
                                     <button className='btn btn-sm float-end btn-info'>View</button>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <br />
            <hr />
            <h5>List of Credit Cards</h5>
        </div>
    );
}

