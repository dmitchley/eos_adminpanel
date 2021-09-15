import { NOTIFICATION_CLICK, ADD_NOTIFICATION, DISPLAY_NOTIFICATION, REQ_DISPLAY_NOTIFICATION, REQ_DISPLAY_NOTIFICATION_CLOSE, TOTAL_NOTIFICATION_COUNT  } from "./ActionTypes";

export const handleNotificationClick = (data) => {
    return {
        type: NOTIFICATION_CLICK,
        data: data,
    };
};

export const requestDisplayNotification = (data) => {
    return {
        type: REQ_DISPLAY_NOTIFICATION,
    }
};

export const requestDisplayNotificationClose = (data) => {
    return {
        type: REQ_DISPLAY_NOTIFICATION_CLOSE,
    }
};

export const displayNotifications = (data) => {
    return {
        type: DISPLAY_NOTIFICATION,
        data: data,
    };
};

export const addNotification = (data) => {
    return {
        type: ADD_NOTIFICATION,
        data: data,
    }
};

export const displayNotificationCount = (data) => {
    return {
        type: TOTAL_NOTIFICATION_COUNT,
        data: data
    }
};