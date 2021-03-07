import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSessionName, setData, setConfetti } from '../../store/session';
import { ucfirst, trimName } from '../../libraries/stringHelper';
import { allPlayersVoted, getUserPoint, isConsistent } from '../../libraries/playerHelper';
import db from '../../libraries/database';
import Table from '../Table/Table';
import Cards from '../Cards/Cards';
import './Room.scss';

function Room({ match }) {
    const [showPoints, setShowPoints] = useState(false);
    const [userPoint, setUserPoint] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionName = trimName(match.params.sessionName);
    const sessionData = useSelector((state) => state.session.data);
    const userName = useSelector((state) => state.user.userName);

    useEffect(() => {
        if (sessionName && userName) {
            dispatch(setSessionName(sessionName));
            // sign in
            db.signIn(sessionName, userName);
            // listener
            db.attachListener((snapshot) => {
                console.log('Session data updated');
                const data = snapshot.val();
                dispatch(setData(data));
                // points
                const shouldShowVotes = data.showPoints ? true : allPlayersVoted(data.players);
                setShowPoints(shouldShowVotes);
                setUserPoint(getUserPoint(data.players, userName));
                if (shouldShowVotes && isConsistent(data.players)) {
                    dispatch(setConfetti(true));
                    window.setTimeout(() => dispatch(setConfetti(false)), 5000);
                }
            });
            // clean up
            return () => {
                db.detachListener();
                db.offline();
            };
        } else {
            history.push('/');
        }
    }, [dispatch, history, sessionName, userName]);

    return (
        <div className="__room" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/poker-desk.jpg)` }}>
            <div className="d-flex align-items-center justify-content-center __room__session">
                <h1 className="text-white mb-0">{ucfirst(sessionName)}</h1>
                <div className="ms-3 d-none">
                    <select className="form-select form-select-sm bg-light text-center" defaultValue="Standard">
                        <option value="Standard">Standard</option>
                        <option value="Cheater">Cheater</option>
                    </select>
                </div>
            </div>
            <div className="mx-auto __room__table">
                <Table players={sessionData.players || {}} showPoints={showPoints} />
            </div>
            <div className="row justify-content-between">
                <div className="col-2">
                    <button className="btn btn-secondary w-100" onClick={() => db.clearVotes()}>
                        Clear Votes
                    </button>
                </div>
                <div className="col-8">
                    <Cards userPoint={userPoint} showPoints={showPoints} />
                </div>
                <div className="col-2">
                    <button className="btn btn-secondary w-100" onClick={() => db.showVotes()}>
                        Show Votes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Room;
