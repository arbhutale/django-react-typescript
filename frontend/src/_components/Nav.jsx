import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { authActions, userActions } from '../_store';

export { Nav };

function Nav() {
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const auth = useSelector(x => x.auth.value);
    const logout = () => dispatch(authActions.logout());
    const memoizedUser = useMemo(() => user, [user]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const newUser = await dispatch(userActions.getAll()).unwrap();
                if (newUser !== user) { // Check if the user has changed
                    setUser(newUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [auth]);


    // only show nav when logged in
    if (!auth) return null

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container">
                <a className="navbar-brand" href="#">ARB Finance</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-item nav-link"> Dashboard
                                {/* <span className="visually-hidden"></span> */}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="/loans">Loans</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/invoice">Invoice</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-md-auto">
                        <li className="nav-item">
                            <a target="_blank" rel="noopener" className="nav-link" href="https://github.com/thomaspark/bootswatch/"><i className="bi bi-github"></i><span className="d-lg-none ms-2">GitHub</span></a>
                        </li>
                        <li className="nav-item">
                            <a target="_blank" rel="noopener" className="nav-link" href="https://twitter.com/bootswatch"><i className="bi bi-twitter"></i><span className="d-lg-none ms-2">Twitter</span></a>
                        </li>
                        <li className="nav-item py-2 py-lg-1 col-12 col-lg-auto">
                            <div className="vr d-none d-lg-flex h-100 mx-lg-2 text-white"></div>
                            <hr className="d-lg-none my-2 text-white-50" />
                        </li>
                        <li className="nav-item dropdown" data-bs-theme="light">
                            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="theme-menu" aria-expanded="true" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme">
                                <i className="bi bi-person-circle"></i>
                                <span className="d-lg-none ms-2">Toggle theme</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                                <li>
                                    <button type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
                                        <i className="bi bi-person-fill"></i><span className="ms-2">{memoizedUser?.username}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={logout} type="button" className="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="true">
                                        <i className="bi bi-box-arrow-in-left"></i><span className="ms-2">Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <span className="btn btn-link nav-item nav-link">{memoizedUser?.username}</span>
                </div>
            </div>
        </nav>

    );
}