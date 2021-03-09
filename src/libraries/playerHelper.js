export function getUserPoint(players, userName) {
    if (!players || !players[userName]) {
        return null;
    }
    return players[userName].point;
}

export function allPlayersVoted(players) {
    return (
        Object.values(players).filter((player) => {
            return player.point === 0;
        }).length === 0
    );
}

export function isConsistent(players) {
    const playerArr = Object.values(players);
    // find out online players who voted
    const validPlayerArr = playerArr.filter((player) => {
        return player.connected && player.point >= 0;
    });
    const consistent =
        validPlayerArr.length >= 2 &&
        validPlayerArr[0].point > 0 &&
        validPlayerArr.every((player) => {
            return player.point === validPlayerArr[0].point;
        });
    return consistent;
}
