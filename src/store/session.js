import { createSlice } from '@reduxjs/toolkit';

import { trimName } from 'libraries/stringHelper';

const KEY_SESSION_NAME = 'room';

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        sessionName: localStorage.getItem(KEY_SESSION_NAME) || '',
        confetti: false,
        data: {
            showPoints: 0,
            players: {
                // AAA: { point: -1, connected: true, cheated: false },
                // BBB: { point: 0, connected: true, cheated: false },
                // CCC: { point: 1, connected: true, cheated: false },
                // DDD: { point: 2, connected: false, cheated: false },
                // EEE: { point: 3, connected: true, cheated: true },
                // FFF: { point: 5, connected: true, cheated: false },
            },
        },
    },
    reducers: {
        setSessionName: (state, action) => {
            const sessionName = trimName(action.payload);
            localStorage.setItem(KEY_SESSION_NAME, sessionName);
            state.sessionName = sessionName;
        },
        setSessionData: (state, action) => {
            const newData = { ...state.data, ...action.payload };
            if (typeof newData.players !== 'object') {
                newData.players = {};
            }
            state.data = newData;
        },
        setConfetti: (state, action) => {
            state.confetti = !!action.payload;
        },
    },
});

export const { setSessionName, setSessionData, setConfetti } = sessionSlice.actions;

export default sessionSlice.reducer;
