import firebase from 'firebase/app';
import 'firebase/database';
import reporter from './reporter';

class FirebaseClient {
    constructor(config) {
        firebase.initializeApp(config);
        this.db = firebase.database();
        this.sessionName = '';
        this.userName = '';
        reporter.log('new FirebaseClient()');
    }

    signIn(sessionName, userName) {
        console.info('DB connected');
        this.db.goOnline();
        this.sessionName = sessionName;
        this.userName = userName;
        if (this.userName) {
            this.setPoint(0);
            // track online status
            const connectedRef = this.db.ref('.info/connected');
            connectedRef.on('value', (snap) => {
                if (snap.val() === true) {
                    const con = this.db.ref(this.sessionName + '/players/' + this.userName + '/connected');
                    con.onDisconnect().remove();
                    con.set(true);
                }
            });
        }
    }

    setPoint(point, cheated = false) {
        const data = {
            '/point': point,
            '/connected': true,
            '/cheated': cheated,
        };
        this.db
            .ref(this.sessionName + '/players/' + this.userName)
            .update(data)
            .catch(this.errorHandler);
    }

    clearVotes() {
        this.db
            .ref(this.sessionName)
            .once('value')
            .then((snapshot) => {
                const res = snapshot.val();
                const newSessionData = {
                    time: new Date().toISOString(),
                    showPoints: 0,
                    players: {},
                };
                for (const index in res.players) {
                    newSessionData.players[index] = {
                        point: 0,
                        cheated: false,
                        connected: !!res.players[index].connected,
                    };
                }
                this.db.ref(this.sessionName).set(newSessionData).catch(this.errorHandler);
            })
            .catch(this.errorHandler);
    }

    showVotes() {
        this.db
            .ref(this.sessionName + '/showPoints')
            .set(1)
            .catch(this.errorHandler);
    }

    deletePlayer(userName) {
        if (userName) {
            this.db
                .ref(this.sessionName + '/players/' + userName)
                .remove()
                .catch(this.errorHandler);
        }
    }

    attachListener(callbackFunc) {
        this.db.ref(this.sessionName).off();
        this.db.ref(this.sessionName).on('value', callbackFunc);
        console.info('Watching session: ' + this.sessionName);
    }

    detachListener() {
        this.db.ref(this.sessionName).off();
        this.db.ref('.info/connected').off();
        console.info('Detach listener: ' + this.sessionName);
    }

    offline() {
        console.info('DB disconnected');
        this.db.goOffline();
    }

    errorHandler(res) {
        console.error(res);
    }
}

const database = new FirebaseClient({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export default database;
