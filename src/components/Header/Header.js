import { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setUserName } from 'store/user';
import { ucfirst, trimName } from 'libraries/stringHelper';
import db from 'libraries/database';
import Modal from 'components/Utilities/Modal';
import './Header.scss';

function getSessionNameFromPath(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'poker' || parts[0] === 'tshirt') {
        return parts[1] || null;
    }
    return parts.length >= 1 ? parts[0] : null;
}

function Header() {
    const dispatch = useDispatch();
    const userName = useSelector((state) => state.user.userName);
    const displayName = useSelector((state) => state.user.displayName);
    const location = useLocation();
    const history = useHistory();
    const pathname = location.pathname || '';
    const sessionName = getSessionNameFromPath(pathname);
    const inRoom = sessionName && pathname !== '/';
    const onPoker = inRoom && (pathname.startsWith('/poker/') || (!pathname.startsWith('/tshirt/') && !pathname.startsWith('/poker/')));
    const onTshirt = inRoom && pathname.startsWith('/tshirt/');

    const [showNameModal, setShowNameModal] = useState(false);
    const [nameInput, setNameInput] = useState('');

    const goToPoker = (e) => {
        e.preventDefault();
        if (sessionName) history.push(`/poker/${sessionName}`);
    };
    const goToTshirt = (e) => {
        e.preventDefault();
        if (sessionName) history.push(`/tshirt/${sessionName}`);
    };

    const openNameModal = () => {
        const nameToShow = displayName || userName || '';
        setNameInput(nameToShow ? ucfirst(nameToShow) : '');
        setShowNameModal(true);
    };

    const saveName = () => {
        const trimmed = (nameInput || '').trim();
        if (!trimmed) return;
        dispatch(setUserName(trimmed));
        if (inRoom) db.renameUser(trimName(trimmed));
    };

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
                        <button
                            type="button"
                            className={`nav-link ${onPoker ? 'active' : ''}`}
                            onClick={goToPoker}
                        >
                            Poker
                        </button>
                        <button
                            type="button"
                            className={`nav-link ${onTshirt ? 'active' : ''}`}
                            onClick={goToTshirt}
                        >
                            T-shirt
                        </button>
                    </div>
                )}
                <div className="navbar-text ms-auto">
                    <img className="__header__profile" alt="profile" src="img/profile.svg" />
                    <button
                        type="button"
                        className="__header__name ms-1"
                        onClick={openNameModal}
                        title="Change your name"
                    >
                        {displayName ? ucfirst(displayName) : 'Guest'}
                    </button>
                </div>
            </div>
            {showNameModal && (
                <Modal
                    title="Change your name"
                    body={
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Your nickname"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveName();
                                    setShowNameModal(false);
                                }
                            }}
                            autoFocus
                        />
                    }
                    confirmText="Save"
                    confirmHandler={saveName}
                    setVisibility={setShowNameModal}
                />
            )}
        </nav>
    );
}

export default Header;
