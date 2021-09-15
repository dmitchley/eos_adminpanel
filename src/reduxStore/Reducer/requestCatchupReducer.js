import { DISPLAY_REQ_CATCH, EDIT_REQ_CATCH, REQ_DISPLAY_CATCH, REQ_DISPLAY_CATCH_CLOSE, TOTAL_REQ_CATCH_NOTI_COUNT } from "../Action/ActionTypes";
import _ from 'lodash';

const INITIAL_STATE = {
    reqCatchData: [],
    isGetInitialData: false,
    showReqLoader: false,
    reqCatchNotiCount: 0
};

const getUniqueRecord = (data) => {
    // return _.uniqBy(data, 'id');
    const validateData = data.map((item) => {
        return { ...item, id: item.req_catch_class_id }
    })
    return _.uniqBy(validateData, 'id');
}

const appointmentReducer = (state = INITIAL_STATE, action) => {
    const { reqCatchData, reqCatchNotiCount } = state;
    switch (action.type) {
        case DISPLAY_REQ_CATCH:
            return {
                ...state,
                isGetInitialData: true,
                showReqLoader: false,
                reqCatchData: getUniqueRecord([...reqCatchData, ...action.data])
            };
        case EDIT_REQ_CATCH:
            const index = reqCatchData.findIndex(post => post.req_catch_class_id === action.data.req_catch_class_id);
            const updateReq = [
                ...reqCatchData.slice(0, index), // everything before current post
                {
                    ...reqCatchData[index],
                    ...action.data.data
                },
                ...reqCatchData.slice(index + 1), // everything after current post
            ]

            return {
                ...state,
                reqCatchData: updateReq
            }
        case REQ_DISPLAY_CATCH:
            return {
                ...state,
                showReqLoader: true
            };
        case REQ_DISPLAY_CATCH_CLOSE:
            return {
                ...state,
                showReqLoader: false
            };
        case TOTAL_REQ_CATCH_NOTI_COUNT:
            return {
                ...state,
                reqCatchNotiCount: reqCatchNotiCount + (action.data)
            };
        default:
            return state;
    }
}
export default appointmentReducer;