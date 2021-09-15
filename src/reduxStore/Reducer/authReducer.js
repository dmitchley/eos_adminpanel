import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST
} from 'reduxStore/Action/ActionTypes';
const INITIAL_STATE = {
    isLoggingIn: false,
    loginError: false
};
const authReducer = (state = INITIAL_STATE, action) => {
    console.log("satte", state);
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                loginError: true
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingIn: false,
                loginError: false
            };
        default:
            return state;
    }
}

export default authReducer