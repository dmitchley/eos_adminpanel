import { DISPLAY_UNIFORM_REQUEST, REQ_DISPLAY_UNIFORM_REQUEST, REQ_DISPLAY_UNIFORM_REQUEST_CLOSE, TOTAL_UNIFORM_NOTI_COUNT } from "./ActionTypes";

export const displayRequest = (data) => {
    return {
        type: DISPLAY_UNIFORM_REQUEST,
        data: data,
    };
};

export const requestDisplayUniform = (data) => {
    return {
        type: REQ_DISPLAY_UNIFORM_REQUEST,
    }
};

export const requestDisplayUniformClose = (data) => {
    return {
        type: REQ_DISPLAY_UNIFORM_REQUEST_CLOSE,
    }
};

export const displayUniformNotiCount = (data) => {
    return {
        type: TOTAL_UNIFORM_NOTI_COUNT,
        data: data
    }
};

// export const displayUniformNotiCount2 = (data) => {
//     return {
//         type: TOTAL_UNIFORM_NOTI_COUNT,
//         data: data
//     }
// };