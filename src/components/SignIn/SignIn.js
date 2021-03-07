import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUserName } from '../../store/user';
import { trimName } from '../../libraries/stringHelper';
// import style from './Header.module.scss';

function SignIn() {
    const dispatch = useDispatch();
    const history = useHistory();

    const defaultSessionName = useSelector((state) => state.session.sessionName);
    const defaultUserName = useSelector((state) => state.user.userName);

    const [sessionName, updateSessionName] = useState(defaultSessionName);
    const [userName, updateUserName] = useState(defaultUserName);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (sessionName && userName) {
            dispatch(setUserName(userName));
            history.push(`/${sessionName}`);
        }
    };

    return (
        <div className="py-5">
            <h1 className="mb-5 text-center text-white">Sign In</h1>
            <form className="w-50 mx-auto text-light" onSubmit={handleSubmit}>
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
                        onChange={(event) => updateSessionName(trimName(event.target.value))}
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
                        value={userName}
                        onChange={(event) => updateUserName(trimName(event.target.value))}
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary px-4">
                        Join Session
                    </button>
                    <span className="me-2 ms-3">OR</span>
                    <a className="text-primary" href={`#/${sessionName}?observer`}>
                        Join As Observer
                    </a>
                </div>
            </form>
        </div>
    );
}

export default SignIn;
