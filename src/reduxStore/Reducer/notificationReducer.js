import { NOTIFICATION_CLICK, ADD_NOTIFICATION, DISPLAY_NOTIFICATION, REQ_DISPLAY_NOTIFICATION, REQ_DISPLAY_NOTIFICATION_CLOSE, TOTAL_NOTIFICATION_COUNT } from '../Action/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
    notificationRoute: '',
    isNotificationClick: false,
    notificationsData: [],
    isGetInitialData: false,
    showNotificationLoader: false,
    totalNotificationCount: 0
};

const notificationReducer = (state = INITIAL_STATE, action) => {
    const { requestData, notificationsData, totalNotificationCount } = state;
    console.log('----- notificationReducer -----');
    console.log(action)
    switch (action.type) {
        case NOTIFICATION_CLICK:
            // return [...state, action.data];
            return {
                ...state,
                isNotificationClick: true,
                notificationRoute: action.data
            };
        case DISPLAY_NOTIFICATION:
            return {
                ...state,
                isGetInitialData: true,
                showNotificationLoader: false,
                notificationsData: [...notificationsData, ...action.data]
            };
        case ADD_NOTIFICATION:
            notificationsData.push(action.data);
            return {
                ...state,
                notificationsData: [...notificationsData]
            };
        case REQ_DISPLAY_NOTIFICATION:
            return {
                ...state,
                showNotificationLoader: true
            };
        case REQ_DISPLAY_NOTIFICATION_CLOSE:
            return {
                ...state,
                showNotificationLoader: false
            };
        case TOTAL_NOTIFICATION_COUNT:
            return {
                ...state,
                totalNotificationCount: totalNotificationCount + action.data
            };
        default:
            return state;
    }
}
export default notificationReducer;