import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setUserName } from 'store/user';
import { trimName } from 'libraries/stringHelper';

function SignIn() {
    const dispatch = useDispatch();
    const history = useHistory();

    const defaultSessionName = useSelector((state) => state.session.sessionName);
    const defaultUserName = useSelector((state) => state.user.displayName || state.user.userName);

    const [sessionName, updateSessionName] = useState(defaultSessionName);
    const [userName, updateUserName] = useState(defaultUserName);

    const handleJoin = (sessionType) => (event) => {
        event.preventDefault();
        if (sessionName && userName) {
            dispatch(setUserName(userName));
            const base = trimName(sessionName);
            history.push(sessionType === 'tshirt' ? '/tshirt/' + base : '/' + base);
        }
    };

    return (
        <div className="py-5">
            <h1 className="mb-5 text-center text-white">Sign In</h1>
            <form className="w-50 mx-auto text-light" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                    <label htmlFor="room" className="form-label">
                        Session Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        id="session_name"
                        name="session_name"
                        placeholder="e.g. avengers/fantastic4..."
                        value={sessionName}
                        onChange={(event) => updateSessionName(event.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="form-label">
                        Your Nickname
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        required
                        id="user_name"
                        name="user_name"
                        placeholder="Please pick a unique nickname..."
                        value={userName}
                        onChange={(event) => updateUserName(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label d-block">Session type</label>
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={handleJoin('points')}
                        disabled={!sessionName || !userName}
                    >
                        Join Planning Poker
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleJoin('tshirt')}
                        disabled={!sessionName || !userName}
                    >
                        Join T-shirt sizing
                    </button>
                </div>
                <div>
                    <span className="me-2">OR</span>
                    <Link to={'/' + trimName(sessionName) + '?observer'} className="text-primary me-3">
                        Join As Observer
                    </Link>
                    <Link to={'/tshirt/' + trimName(sessionName) + '?observer'} className="text-primary">
                        Observe T-shirt session
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default SignIn;
