import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST
} from './ActionTypes';


export const receiveLogin = (user) => {
    return {
        type: LOGIN_SUCCESS,
        user
    };
};

export const loginError = () => {
    return {
        type: LOGIN_FAILURE
    };
};

export const requestLogout = () => {
    return {
        type: LOGOUT_REQUEST
    };
};