import {
    FCM_TOKEN_REQUEST
} from './ActionTypes';

export const requestToken = (data) => {
    return {
        type: FCM_TOKEN_REQUEST,
        data: data,
    };
};
