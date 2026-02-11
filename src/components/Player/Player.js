import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';

import { setRemovedSelf } from 'store/session';
import Modal from 'components/Utilities/Modal';
import db from 'libraries/database';
import { ucfirst } from 'libraries/stringHelper';
import { isUnvoted } from 'libraries/playerHelper';
import reporter from 'libraries/reporter';
import './Player.scss';

function Player({ name, player, showVotes, mode = 'points' }) {
    reporter.log('Player render()');

    const hasVoted = !isUnvoted(player.point, mode);
    let cardStatus = 'none';
    if (!player.connected) {
        cardStatus = 'offline';
    } else if (showVotes) {
        cardStatus = 'front';
    } else if (hasVoted) {
        cardStatus = 'back';
    }

    const [removeModal, setRemoveModal] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const cheated = showVotes && player.cheated && player.connected;

    return (
        <div
            className="text-center __player"
            onContextMenu={(event) => {
                event.preventDefault();
                setRemoveModal(true);
            }}
        >
            <div className="mx-auto __player__container">
                <div className="__player__container__warpper">
                    <CSSTransition
                        in={cardStatus === 'offline'}
                        unmountOnExit
                        exit={false}
                        timeout={300}
                        classNames="card"
                    >
                        <img src="img/offline.png" />
                    </CSSTransition>
                    <CSSTransition
                        in={cardStatus === 'back'}
                        unmountOnExit
                        exit={false}
                        timeout={300}
                        classNames="card"
                    >
                        <img src="img/back.png" />
                    </CSSTransition>
                    <CSSTransition
                        in={cardStatus === 'front'}
                        unmountOnExit
                        exit={false}
                        timeout={300}
                        classNames="card"
                    >
                        {mode === 'tshirt' ? (
                            isUnvoted(player.point, 'tshirt') ? (
                                <img src="img/0.png" alt="Pass" />
                            ) : (
                                <span
                                    className={`__player__size __player__size--${String(player.point ?? '').toLowerCase()}`}
                                    aria-label={`Vote: ${player.point}`}
                                >
                                    {player.point}
                                </span>
                            )
                        ) : (
                            <img src={`img/${player.point}.png`} alt={player.point} />
                        )}
                    </CSSTransition>
                    {user.trackCheating && cheated && (
                        <img src="img/cheat.gif" width="62" title="Vote has been changed. It's magic!" />
                    )}
                </div>
            </div>
            <div className={`${user.userName === name ? 'text-warning' : ''} __player__name`}>
                {user.userName === name && user.displayName ? user.displayName : ucfirst(name)}
            </div>
            {removeModal && (
                <Modal
                    title={`Remove Player "${name}" ?`}
                    body={<i>* Players can join as observers if they don't intend to vote.</i>}
                    setVisibility={setRemoveModal}
                    confirmText="Remove"
                    confirmHandler={() => {
                        db.deletePlayer(name);
                        if (name === user.userName) {
                            dispatch(setRemovedSelf(true));
                        }
                    }}
                />
            )}
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

Player.propTypes = {
    name: PropTypes.string,
    player: PropTypes.object,
    showVotes: PropTypes.bool,
    mode: PropTypes.oneOf(['points', 'tshirt']),
};

export default React.memo(Player, areEqual);
