const functions = require('firebase-functions');

// when ShowVotes button is clicked
exports.showPoints = functions.database.ref('/{room}/showPoints').onWrite((change, context) => {
    const previousValue = change.before.val();
    const currentValue = change.after.val();

    if (previousValue != 1 && currentValue == 1) {
        change.after.ref.parent
            .once('value')
            .then(snapAfter => {
                const roomAfter = snapAfter.val();
                const pointsAfter = playerPoints(roomAfter.players, false);
                if (pointsAfter.length >= 2) {
                    return pushToElastic(context.params.room, pointsAfter, getSessionTime(roomAfter));
                } else {
                    console.info('== Data invalid, skipped.');
                    return null;
                }
            });
    } else {
        console.info('== Someone clicked ShowVotes more than one time, skipped.');
        return null;
    }
});

// when everyone voted
exports.everyoneVoted = functions.database.ref('/{room}/players/{playerName}/point').onWrite((change, context) => {
    const previousValue = change.before.val();
    const currentValue = change.after.val();

    if (previousValue <= 0 && currentValue > 0) {
        change.after.ref.parent.parent.parent.once('value').then(snapAfter => {
            const roomAfter = snapAfter.val();
            const pointsAfter = playerPoints(roomAfter.players, true);
            if (pointsAfter.length >= 2) {
                return pushToElastic(context.params.room, pointsAfter, getSessionTime(roomAfter));
            } else {
                console.info('== Wait, some one did not vote.');
                return null;
            }
        });
    } else {
        console.info('== Someone changed the point, skipped.');
        return null;
    }
});

/* ====== helper functions ====== */

// should return a promise
function pushToElastic(roomName, points, sessionTime) {
    // client
    const { Client } = require('@elastic/elasticsearch');
    const client = new Client({
        node: functions.config().elastic.host,
        maxRetries: 1,
        requestTimeout: 1000,
        auth: {
            username: functions.config().elastic.user,
            password: functions.config().elastic.pwd,
        },
    });
    // payload
    const payload = {
        index: 'planning-poker',
        id: roomName.replace(/\W/g, '') + '@' + sessionTime.substr(0,16),
        body: {
            room: roomName,
            time: sessionTime,
            points: shuffle(points),
        },
    };
    // request
    return client
        .index(payload)
        .then(result => {
            console.info('== SUCCESS : HTTP ' + result.statusCode);
            return true;
        })
        .catch(err => {
            console.error('== ERROR : HTTP ' + err.statusCode);
            return false;
        });
}

function shuffle(arr) {
    let j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function playerPoints(players, validate) {
    const points = [];
    for (const key in players) {
        if (players[key].point > 0) {
            points.push(players[key].point);
        }
        if (players[key].point == 0 && validate) {
            return [];
        }
    }
    return points;
}

function getSessionTime(room) {
    return room.time ? room.time : new Date().toISOString();
}
