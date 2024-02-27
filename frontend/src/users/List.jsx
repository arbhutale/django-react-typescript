import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '../_store';

export { List };

function List() {
    const users = useSelector(x => x.users.list?.value);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Username</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
              
                    {!users?.loading  &&
                        <tr >
                            {/* <td>{users?.id}</td> */}
                            {/* <td>{users?.value.usersname}</td>
                            <td>{users?.value.username}</td> */}
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`edit/${1}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                {/* <button onClick={() => dispatch(userActions.delete(users.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={users.isDeleting}>
                                    {users.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button> */}
                            </td>
                        </tr>
                    }
                    {users?.loading &&
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
