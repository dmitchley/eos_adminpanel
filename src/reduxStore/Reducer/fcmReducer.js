import {
    FCM_TOKEN_REQUEST,
} from 'reduxStore/Action/ActionTypes';
const INITIAL_STATE = {
   token: [],
   isTokenSaved: false
};
const authReducer = (state = INITIAL_STATE, action) => {
    console.log("satte", state);
    const { token } = state;
    switch (action.type) {
        case FCM_TOKEN_REQUEST:
            return {
                ...state,
                isTokenSaved: true,
                token: [...token, ...action.data]
            };
        default:
            return state;
    }
}

export default authReducer