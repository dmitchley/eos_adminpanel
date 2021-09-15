import { ADD_TIMESLOT, DISPLAY_TIMESLOT, IMPORT_TIMESLOT_START, IMPORT_TIMESLOT_FINISH, REQ_DISPLAY_TIMESLOT, REQ_DISPLAY_TIMESLOT_CLOSE } from "./ActionTypes";

export const displayTimeSlot = (data) => {
    return {
        type: DISPLAY_TIMESLOT,
        data: data,
    };
};

export const requestDisplayTimeslot = (data) => {
    return {
        type: REQ_DISPLAY_TIMESLOT,
    }
};

export const requestDisplayTimeslotClose = (data) => {
    return {
        type: REQ_DISPLAY_TIMESLOT_CLOSE,
    }
};

export const addTimeSlot = (data) => {
    return {
        type: ADD_TIMESLOT,
        data: data,
    }
};

export const startTimeSlotImport = (data) => {
    return {
        type: IMPORT_TIMESLOT_START,
    }
};

export const finishTimeSlotImport = (data) => {
    return {
        type: IMPORT_TIMESLOT_FINISH,
        data: data,
    }
};