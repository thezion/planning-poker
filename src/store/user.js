import { createSlice } from '@reduxjs/toolkit';
import { trimName } from '../libraries/stringHelper';

const KEY_USER_NAME = 'myName';
const KEY_SETTING_TRACK_CHEATING = 'trackCheating';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: localStorage.getItem(KEY_USER_NAME) || '',
        trackCheating: !!localStorage.getItem(KEY_SETTING_TRACK_CHEATING),
    },
    reducers: {
        setUserName: (state, action) => {
            const userName = trimName(action.payload);
            localStorage.setItem(KEY_USER_NAME, userName);
            state.userName = userName;
        },
        setTrackCheating: (state, action) => {
            localStorage.setItem(KEY_SETTING_TRACK_CHEATING, action.payload);
            state.trackCheating = action.payload;
        },
    },
});

export const { setUserName, setTrackCheating } = userSlice.actions;

export default userSlice.reducer;
