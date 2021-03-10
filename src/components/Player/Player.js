import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';
import db from '../../libraries/database';
import { ucfirst } from '../../libraries/stringHelper';
import reporter from '../../libraries/reporter';
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

    const user = useSelector((state) => state.user);
    const cheated = showPoints && player.cheated && player.connected;

    return (
        <div
            className="text-center __player"
            onContextMenu={(event) => {
                event.preventDefault();
                removePlayer(name);
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
                    {user.trackCheating && cheated && <img src="img/cheat.gif" width="62" />}
                </div>
            </div>
            <div className={`${user.userName === name ? 'text-warning' : ''} __player__name`}>{ucfirst(name)}</div>
        </div>
    );
}

function removePlayer(playerName) {
    if (window.confirm('Remove player "' + playerName + '" ?')) {
        db.deletePlayer(playerName);
    }
}

function areEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(Player, areEqual);
