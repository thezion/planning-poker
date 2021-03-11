import React, { Suspense, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setSessionName, setData, setConfetti } from 'store/session';
import { setTrackCheating } from 'store/user';
import { ucfirst, trimName } from 'libraries/stringHelper';
import { getAvgPoint } from 'libraries/mathHelper';
import { allPlayersVoted, getUserPoint, isConsistent } from 'libraries/playerHelper';
import db from 'libraries/database';
import reporter from 'libraries/reporter';
import Table from 'components/Table/Table';
import Cards from 'components/Cards/Cards';
import Loading from 'components/Utilities/Loading';
import './Room.scss';

const Analytic = React.lazy(() => import('../Analytic/Analytic'));

function Room({ match, location }) {
    const dispatch = useDispatch();
    const history = useHistory();
    // parse url
    const sessionName = trimName(match.params.sessionName);
    const observer = location.search.indexOf('?observer') === 0;
    // state
    const [showPoints, setShowPoints] = useState(false);
    const [userPoint, setUserPoint] = useState(null);
    const [analytics, setAnalytics] = useState(false);
    // store
    const sessionData = useSelector((state) => state.session.data);
    const userName = useSelector((state) => (observer ? '' : state.user.userName));
    const trackCheating = useSelector((state) => state.user.trackCheating);

    useEffect(() => {
        if (sessionName) {
            dispatch(setSessionName(sessionName));
        }
        if (sessionName && (userName || observer)) {
            db.initialize(sessionName, userName);
            // listener
            db.attachListener((snapshot) => {
                reporter.log('Session data updated');
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
    }, [dispatch, history, sessionName, userName, observer]);

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

            {!observer && (
                <div className="row">
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
                            {showPoints ? 'Avg = ' + getAvgPoint(sessionData.players || {}) + ' pt' : 'Show Votes'}
                        </button>
                    </div>
                </div>
            )}

            {observer && (
                <div className="mt-4 pt-5">
                    <h4 className="text-center text-light --with-dash">You are an observer of this session</h4>
                </div>
            )}

            <div className="mt-5 text-secondary text-center">
                <h4 className="--with-dash">Setting &amp; Help</h4>
                <div className="d-flex justify-content-center">
                    <div className="form-check form-switch mx-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxAnalytics"
                            checked={analytics}
                            onChange={(event) => setAnalytics(event.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkboxAnalytics">
                            Show analytics
                        </label>
                    </div>
                    <div className="form-check form-switch mx-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxCheating"
                            checked={trackCheating}
                            onChange={(event) => dispatch(setTrackCheating(event.target.checked))}
                        />
                        <label className="form-check-label" htmlFor="checkboxCheating">
                            Track cheating
                        </label>
                    </div>
                    <div>
                        <span className="ms-2 me-3">|</span>To remove a player, right click the name
                    </div>
                </div>
            </div>

            {analytics && (
                <Suspense fallback={<Loading />}>
                    <div className="mt-5 text-secondary ">
                        <h4 className="text-center --with-dash">Analytics</h4>
                        <Analytic sessionName={sessionName} />
                    </div>
                </Suspense>
            )}
        </div>
    );
}

export default Room;
