import { ADD_TIMESLOT, DISPLAY_TIMESLOT, IMPORT_TIMESLOT_START, IMPORT_TIMESLOT_FINISH, REQ_DISPLAY_TIMESLOT, REQ_DISPLAY_TIMESLOT_CLOSE } from "../Action/ActionTypes";
import _ from 'lodash';
import { getTotalSizeofParent } from 'actionStore/FirebaseAction/parentAction';

const INITIAL_STATE = {
    timeSlotData: [],
    isImportTimeSlotData: false,
    isGetInitialData: false,
    showTimeslotLoader: false,
};

const getUniqueRecord = (data) => {
    // return _.uniqBy(data, 'id');
    const validateData = data.map((item) => {
        return { ...item, id: item.timeslot_id }
    })
    return _.uniqBy(validateData, 'id');
}

const timeSlotReducer = (state = INITIAL_STATE, action) => {
    const { timeSlotData } = state;
    switch (action.type) {
        case DISPLAY_TIMESLOT:
            // return [...state, action.data];
            return {
                ...state,
                isGetInitialData: true,
                showTimeslotLoader: false,
                timeSlotData: [...timeSlotData, ...action.data]
            };
        case ADD_TIMESLOT:
            timeSlotData.push(action.data);
            return {
                ...state,
                timeSlotData: getUniqueRecord([...timeSlotData])
            };
        // return [...state, action.payload];
        case IMPORT_TIMESLOT_START:
            return {
                ...state,
                isImportTimeSlotData: true
            };
        case IMPORT_TIMESLOT_FINISH:
            return {
                ...state,
                isImportTimeSlotData: false,
                // timeSlotData: getUniqueRecord([...timeSlotData, ...action.data])
            };
        case REQ_DISPLAY_TIMESLOT:
            return {
                ...state,
                showTimeslotLoader: true
            };
        case REQ_DISPLAY_TIMESLOT_CLOSE:
            return {
                ...state,
                showTimeslotLoader: false
            };
        default:
            return state;
    }
}
export default timeSlotReducer;