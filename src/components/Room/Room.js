import React, { Profiler, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setSessionName, setSessionData, setConfetti } from 'store/session';
import { ucfirst, trimName } from 'libraries/stringHelper';
import { getAvgPoint } from 'libraries/mathHelper';
import { allPlayersVoted, getUserPoint, isConsistent } from 'libraries/playerHelper';
import db from 'libraries/database';
import reporter from 'libraries/reporter';
import Table from 'components/Table/Table';
import Cards from 'components/Cards/Cards';
import TshirtCards from 'components/Cards/TshirtCards';
import Setting from 'components/Setting/Setting';

import './Room.scss';

function Room({ match, location, mode = 'points' }) {
    reporter.log('Room render()');
    const dispatch = useDispatch();
    const history = useHistory();
    // parse url
    const sessionName = trimName(match.params.sessionName);
    const observer = location.search.indexOf('?observer') === 0;
    // get data from store
    const sessionData = useSelector((state) => state.session.data) || {};
    const players = sessionData.players ?? {};
    const userName = useSelector((state) => (observer ? '' : state.user.userName));
    // parse data
    const userPoint = getUserPoint(players, userName);
    const showVotes = sessionData.showPoints ? true : allPlayersVoted(players, mode);
    // confetti
    if (showVotes && isConsistent(players, mode)) {
        dispatch(setConfetti(true));
        window.setTimeout(() => dispatch(setConfetti(false)), 5000);
    }

    useEffect(() => {
        if (sessionName) {
            dispatch(setSessionName(sessionName));
        }
        if (sessionName && (userName || observer)) {
            // Reset session data when switching mode so we don't render stale poker data in t-shirt room (or vice versa)
            dispatch(setSessionData({ showPoints: 0, players: {} }));
            db.initialize(sessionName, userName, mode);
            // listener
            db.attachListener((snapshot) => {
                reporter.log('Session data updated');
                dispatch(setSessionData(snapshot.val()));
            });
            // clean up
            return () => {
                db.detachListener();
                db.offline();
            };
        } else {
            history.push('/');
        }
    }, [dispatch, history, sessionName, userName, observer, mode]);

    return (
        <div className="__room" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/poker-desk.jpg)` }}>
            <div className="d-flex align-items-center justify-content-center __room__session">
                <h1 className="text-white mb-0">{ucfirst(sessionName)}</h1>
            </div>

            <div className="mx-auto __room__table">
                <Profiler id="TableProfiler" onRender={console.log}>
                    <Table players={players} showVotes={showVotes} mode={mode} />
                </Profiler>
            </div>

            {observer ? (
                <div className="mt-4 pt-5">
                    <h4 className="text-center text-light --with-dash">You are an observer of this session</h4>
                </div>
            ) : (
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-secondary w-100" onClick={() => db.clearVotes(mode)}>
                            Clear Votes
                        </button>
                    </div>
                    <div className="col-8">
                        {mode === 'tshirt' ? (
                            <TshirtCards
                                userPoint={typeof userPoint === 'string' ? userPoint : undefined}
                                showVotes={showVotes}
                            />
                        ) : (
                            <Cards userPoint={userPoint} showVotes={showVotes} />
                        )}
                    </div>
                    <div className="col-2">
                        <button
                            className={`btn btn-secondary w-100 __room__reveal-btn ${showVotes ? '__room__reveal-btn--revealed' : ''}`}
                            onClick={() => db.showVotes()}
                        >
                            {showVotes && mode === 'points'
                                ? 'Avg = ' + getAvgPoint(players) + ' pt'
                                : showVotes
                                ? 'Votes revealed'
                                : 'Show Votes'}
                        </button>
                    </div>
                </div>
            )}

            <Setting mode={mode} />
        </div>
    );
}

export default Room;
