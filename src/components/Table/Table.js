import Player from '../Player/Player';
import './Table.scss';

function Table({ players, showPoints }) {
    const PlayerElems = Object.keys(players).map((playerName) => {
        return <Player key={playerName} name={playerName} player={players[playerName]} showPoints={showPoints} />;
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
            {PlayerElems}
        </div>
    );
}

export default Table;
