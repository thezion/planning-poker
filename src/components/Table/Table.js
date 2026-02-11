import PropTypes from 'prop-types';

import Player from 'components/Player/Player';
import Loading from 'components/Utilities/Loading';
import './Table.scss';

function Table({ players, showVotes, mode = 'points' }) {
    const PlayerElems = Object.keys(players).map((playerName) => {
        return (
            <Player
                key={playerName}
                name={playerName}
                player={players[playerName]}
                showVotes={showVotes}
                mode={mode}
            />
        );
    });

    let tableSize = 'sm';
    if (PlayerElems.length >= 9 && PlayerElems.length <= 10) {
        tableSize = 'md';
    } else if (PlayerElems.length >= 11) {
        tableSize = 'lg';
    }

    return (
        <div
            className={`w-100 h-100 d-flex flex-wrap justify-content-around align-items-center mx-auto __table--${tableSize}`}
        >
            {PlayerElems.length ? PlayerElems : <Loading />}
        </div>
    );
}

Table.propTypes = {
    players: PropTypes.object,
    showVotes: PropTypes.bool,
    mode: PropTypes.oneOf(['points', 'tshirt']),
};

export default Table;
