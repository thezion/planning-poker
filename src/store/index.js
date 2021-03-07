import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import sessionReducer from './session';

export default configureStore({
    devTools: process.env.NODE_ENV === 'development',
    reducer: {
        user: userReducer,
        session: sessionReducer,
    },
});
