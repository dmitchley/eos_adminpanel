import { ADD_APPOINTMENT, DISPLAY_APPOINTMENT, FILTER_APPOINTMENT, FILTER_APPOINTMENT_CANCEL, GET_CUSTOMER_APPOINTMENT, EDIT_APPOINTMENT, REQ_DISPLAY_APPOINTMENT, REQ_DISPLAY_APPOINTMENT_CLOSE } from "../Action/ActionTypes";
import _ from 'lodash';

const INITIAL_STATE = {
    appointmentData: [],
    originalData: [],
    isGetInitialData: false,
    isFilterOn: false,
    customerData: {},
    showAppointmentLoader: false
};

const getUniqueRecord = (data) => {
    const validateAppointmentData = data.map((item) => {
        return { ...item, id: item.booking_id }
    })
    return _.uniqBy(validateAppointmentData, 'id');
    // return _.uniqBy(data, 'id');
}

const appointmentReducer = (state = INITIAL_STATE, action) => {
    const { appointmentData, originalData } = state;
    switch (action.type) {
        case DISPLAY_APPOINTMENT:
            return {
                ...state,
                isGetInitialData: true,
                showAppointmentLoader: false,
                originalData: getUniqueRecord([...appointmentData, ...action.data]),
                appointmentData: getUniqueRecord([...appointmentData, ...action.data])
            };
        case ADD_APPOINTMENT:
            appointmentData.push(action.data);
            return {
                ...state,
                appointmentData: getUniqueRecord([...appointmentData])
            };
        case FILTER_APPOINTMENT:
            // appointmentData.push(action.data);
            const filterDateArray = originalData.filter((item) => item.date == action.data);

            return {
                ...state,
                isFilterOn: true,
                appointmentData: getUniqueRecord([...filterDateArray])
            };
        case FILTER_APPOINTMENT_CANCEL:
            return {
                ...state,
                isFilterOn: false,
                appointmentData: getUniqueRecord(originalData)
            };
        case GET_CUSTOMER_APPOINTMENT:
            return {
                ...state,
                customerData: action.data
            };
        case EDIT_APPOINTMENT:
            const index = appointmentData.findIndex(post => post.booking_id === action.data.appointmentId);
            const updateAppointmentData = [
                ...appointmentData.slice(0, index), // everything before current post
                {
                    ...appointmentData[index],
                    ...action.data.data
                },
                ...appointmentData.slice(index + 1), // everything after current post
            ]

            return {
                ...state,
                appointmentData: updateAppointmentData
            }
        case REQ_DISPLAY_APPOINTMENT:
            return {
                ...state,
                showAppointmentLoader: true
            };
        case REQ_DISPLAY_APPOINTMENT_CLOSE:
            return {
                ...state,
                showAppointmentLoader: false
            };
        default:
            return state;
    }
}
export default appointmentReducer;