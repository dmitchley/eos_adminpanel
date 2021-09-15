import { DISPLAY_REQ_CATCH, EDIT_REQ_CATCH, REQ_DISPLAY_CATCH, REQ_DISPLAY_CATCH_CLOSE, TOTAL_REQ_CATCH_NOTI_COUNT } from "./ActionTypes";

export const displayRequestCatch = (data) => {
    return {
        type: DISPLAY_REQ_CATCH,
        data: data,
    };
};

export const requestDisplayCatch = (data) => {
    return {
        type: REQ_DISPLAY_CATCH,
    }
};

export const requestDisplayCatchClose = (data) => {
    return {
        type: REQ_DISPLAY_CATCH_CLOSE,
    }
};

export const editRequestCatch = (data) => {
    return {
        type: EDIT_REQ_CATCH,
        data: data,
    }
};

export const displayReqCatchNotiCount = (data) => {
    return {
        type: TOTAL_REQ_CATCH_NOTI_COUNT,
        data: data
    }
};