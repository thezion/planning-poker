import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ucfirst } from 'libraries/stringHelper';
import './Header.scss';

function getSessionNameFromPath(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'poker' || parts[0] === 'tshirt') {
        return parts[1] || null;
    }
    return parts.length >= 1 ? parts[0] : null;
}

function Header() {
    const userName = useSelector((state) => state.user.userName);
    const location = useLocation();
    const pathname = location.pathname || '';
    const sessionName = getSessionNameFromPath(pathname);
    const inRoom = sessionName && pathname !== '/';
    const onPoker = inRoom && (pathname.startsWith('/poker/') || (!pathname.startsWith('/tshirt/') && !pathname.startsWith('/poker/')));
    const onTshirt = inRoom && pathname.startsWith('/tshirt/');

    return (
        <nav className="navbar navbar-dark bg-dark __header">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" title="Back To Sign In Page">
                    <img
                        src="img/favicon-192x192.png"
                        alt="logo"
                        className="d-inline-block align-top me-2 __header__logo"
                    />
                    Planning Poker
                </Link>
                {inRoom && (
                    <div className="navbar-nav __header__nav me-3">
                        <Link
                            className={`nav-link ${onPoker ? 'active' : ''}`}
                            to={`/poker/${sessionName}`}
                        >
                            Poker
                        </Link>
                        <Link
                            className={`nav-link ${onTshirt ? 'active' : ''}`}
                            to={`/tshirt/${sessionName}`}
                        >
                            T-shirt
                        </Link>
                    </div>
                )}
                <div className="navbar-text ms-auto">
                    <img className="__header__profile" alt="profile" src="img/profile.svg" />
                    <span className="ms-1">{ucfirst(userName) || 'Guest'}</span>
                </div>
            </div>
        </nav>
    );
}

export default Header;
