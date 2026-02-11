export function getUserPoint(players, userName) {
    if (!players || !players[userName]) {
        return null;
    }
    return players[userName].point;
}

export function isUnvoted(point, mode = 'points') {
    if (mode === 'tshirt') {
        return point === '' || point === undefined || point === null;
    }
    return point === 0;
}

export function allPlayersVoted(players, mode = 'points') {
    if (!players) return false;
    const hasUnvoted = Object.values(players).some((player) => isUnvoted(player.point, mode));
    return !hasUnvoted;
}

export function isConsistent(players, mode = 'points') {
    const playerArr = Object.values(players || {});
    const validPlayerArr = playerArr.filter((player) => {
        if (!player.connected) return false;
        if (mode === 'tshirt') return player.point !== '' && player.point != null;
        return player.point >= 0 && player.point !== 0;
    });
    if (validPlayerArr.length < 2) return false;
    const first = validPlayerArr[0].point;
    return validPlayerArr.every((player) => player.point === first);
}
