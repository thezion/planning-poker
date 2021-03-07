import { createSlice } from '@reduxjs/toolkit';
import { trimName } from '../libraries/stringHelper';

const KEY_USER_NAME = 'myName';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: localStorage.getItem(KEY_USER_NAME) || '',
        // vote: 0,
    },
    reducers: {
        setUserName: (state, action) => {
            const userName = trimName(action.payload);
            localStorage.setItem(KEY_USER_NAME, userName);
            state.userName = userName;
        },
        // setVote: (state, action) => {
        //     state.vote = action.payload;
        // },
        // resetVote: (state) => {
        //     state.vote = 0;
        // },
    },
});

export const { setUserName } = userSlice.actions;

export default userSlice.reducer;
