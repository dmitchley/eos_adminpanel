import { ADD_APPOINTMENT, DISPLAY_APPOINTMENT, FILTER_APPOINTMENT, FILTER_APPOINTMENT_CANCEL, GET_CUSTOMER_APPOINTMENT, EDIT_APPOINTMENT, REQ_DISPLAY_APPOINTMENT, REQ_DISPLAY_APPOINTMENT_CLOSE } from "./ActionTypes";

export const displayAppointment = (data) => {
    return {
        type: DISPLAY_APPOINTMENT,
        data: data,
    };
};

export const requestDisplayAppointment = (data) => {
    return {
        type: REQ_DISPLAY_APPOINTMENT,
    }
};

export const requestDisplayAppointmentClose = (data) => {
    return {
        type: REQ_DISPLAY_APPOINTMENT_CLOSE,
    }
};

export const addAppointment = (data) => {
    return {
        type: ADD_APPOINTMENT,
        data: data,
    }
};

export const filterAppointment = (data) => {
    return {
        type: FILTER_APPOINTMENT,
        data: data,
    }
};

export const cancelFilterAppointment = (data) => {
    return {
        type: FILTER_APPOINTMENT_CANCEL,
    }
};

export const getCustomerAppointment = (data) => {
    return {
        type: GET_CUSTOMER_APPOINTMENT,
        data: data,
    }
};

export const editAppointment = (data) => {
    return {
        type: EDIT_APPOINTMENT,
        data: data,
    }
};