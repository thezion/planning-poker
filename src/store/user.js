import { createSlice } from '@reduxjs/toolkit';

import { trimName } from 'libraries/stringHelper';

const KEY_USER_NAME = 'myName';
const KEY_DISPLAY_NAME = 'myDisplayName';
const KEY_SETTING_TRACK_CHEATING = 'trackCheating';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: localStorage.getItem(KEY_USER_NAME) || '',
        displayName: localStorage.getItem(KEY_DISPLAY_NAME) || localStorage.getItem(KEY_USER_NAME) || '',
        trackCheating: !!localStorage.getItem(KEY_SETTING_TRACK_CHEATING),
    },
    reducers: {
        setUserName: (state, action) => {
            const payload = (action.payload || '').trim();
            const userName = trimName(action.payload);
            const displayName = payload || userName;
            localStorage.setItem(KEY_USER_NAME, userName);
            localStorage.setItem(KEY_DISPLAY_NAME, displayName);
            state.userName = userName;
            state.displayName = displayName;
        },
        setTrackCheating: (state, action) => {
            localStorage.setItem(KEY_SETTING_TRACK_CHEATING, action.payload);
            state.trackCheating = action.payload;
        },
    },
});

export const { setUserName, setTrackCheating } = userSlice.actions;

export default userSlice.reducer;
