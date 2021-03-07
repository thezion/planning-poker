import { useSelector } from 'react-redux';
import { ucfirst } from '../../libraries/stringHelper';
import './Header.scss';

function Header() {
    const userName = useSelector((state) => state.user.userName);

    return (
        <nav className="navbar navbar-dark bg-dark __header">
            <div className="container-fluid">
                <a className="navbar-brand" href="#/" title="Back To Sign In Page">
                    <img
                        src="img/favicon-192x192.png"
                        alt="logo"
                        className="d-inline-block align-top me-2 __header__logo"
                    />
                    Planning Poker
                </a>
                <div className="navbar-text">
                    <img className="__header__profile" alt="profile" src="img/profile.svg" />
                    <span className="ms-1">{ucfirst(userName) || 'Guest'}</span>
                </div>
            </div>
        </nav>
    );
}

export default Header;
