import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';

import Modal from 'components/Utilities/Modal';
import db from 'libraries/database';
import { ucfirst } from 'libraries/stringHelper';
import reporter from 'libraries/reporter';
import './Player.scss';

function Player({ name, player, showPoints }) {
    reporter.log('Player render()');

    let cardStatus = 'none';
    if (!player.connected) {
        cardStatus = 'offline';
    } else if (showPoints) {
        cardStatus = 'front';
    } else if (player.point !== 0) {
        cardStatus = 'back';
    }

    const [removeModal, setRemoveModal] = useState(false);
    const user = useSelector((state) => state.user);
    const cheated = showPoints && player.cheated && player.connected;

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
                        <img src={`img/${player.point}.png`} />
                    </CSSTransition>
                    {user.trackCheating && cheated && (
                        <img src="img/cheat.gif" width="62" title="Vote has been changed. It's magic!" />
                    )}
                </div>
            </div>
            <div className={`${user.userName === name ? 'text-warning' : ''} __player__name`}>{ucfirst(name)}</div>
            {removeModal && (
                <Modal
                    title={`Remove Player "${name}" ?`}
                    body={<i>* Players can join as observers if they don't intend to vote.</i>}
                    setVisibility={setRemoveModal}
                    confirmText="Remove"
                    confirmHandler={() => db.deletePlayer(name)}
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
    showPoints: PropTypes.bool,
};

export default React.memo(Player, areEqual);
