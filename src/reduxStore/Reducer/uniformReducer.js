import { DISPLAY_UNIFORM_REQUEST, REQ_DISPLAY_UNIFORM_REQUEST, REQ_DISPLAY_UNIFORM_REQUEST_CLOSE, TOTAL_UNIFORM_NOTI_COUNT } from '../Action/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
    requestData: [],
    isGetInitialData: false,
    showUniformLoader: false,
    uniformNotiCount: 0
};

const getUniqueRecord = (data) => {
    return _.uniqBy(data, 'id');
}

const uniformReducer = (state = INITIAL_STATE, action) => {
    const { requestData, uniformNotiCount } = state;
    console.log('----- uniformReducer -----');
    console.log(action)
    switch (action.type) {
        case DISPLAY_UNIFORM_REQUEST:
            // return [...state, action.data];
            return {
                ...state,
                isGetInitialData: true,
                showUniformLoader: false,
                requestData: getUniqueRecord([...requestData, ...action.data])
            };
        case REQ_DISPLAY_UNIFORM_REQUEST:
            return {
                ...state,
                showUniformLoader: true
            };
        case REQ_DISPLAY_UNIFORM_REQUEST_CLOSE:
            return {
                ...state,
                showUniformLoader: false
            };
        case TOTAL_UNIFORM_NOTI_COUNT:
            return {
                ...state,
                uniformNotiCount: uniformNotiCount + (action.data)
            };
        default:
            return state;
    }
}
export default uniformReducer;