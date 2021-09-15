import { addNotificationFB, getAllNotificationData, getNextNotificationData } from 'actionStore/FirebaseAction/notificationAction';

import {
    handleNotificationClick,
    addNotification,
    displayNotifications,
    requestDisplayNotification,
    requestDisplayNotificationClose,
    displayNotificationCount
} from 'reduxStore/Action/notificationAction';

export const onHandleNotification = (requestData) => {
    console.log('---- onHandleNotification -----')
    handleNotificationClick(requestData)
};

export const getAllNotification = () => async (dispatch) => {
    dispatch(requestDisplayNotification())
    const childrenData = await getAllNotificationData();
    if (childrenData != null) {
        console.log('----- getAllNotificationData ------');
        console.log(childrenData)
        dispatch(displayNotifications(childrenData))
    } else {
        dispatch(requestDisplayNotificationClose())
        alert('something went wrong !!')
    }
};

export const getNotificationPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayNotification())
    const childrenData = await getNextNotificationData(lastVisible);
    if (childrenData != null) {
        console.log('----- getNextNotificationData ------');
        console.log(childrenData)
        dispatch(displayNotifications(childrenData))
    } else {
        dispatch(requestDisplayNotificationClose())
        alert('something went wrong !!')
    }
};

export const addNotificationRequest = (data) => async (dispatch) => {
    const isChildAdd = await addNotificationFB(data);
    if (isChildAdd != null) {
        getAllNotification()
        // dispatch(addChild(isChildAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const setNotiCountListener = (count) => async (dispatch) => {
    dispatch(displayNotificationCount(count))
}

export const setNotiCountforReqListener = (count) => async (dispatch) => {
    dispatch(displayNotificationCount(count))
}