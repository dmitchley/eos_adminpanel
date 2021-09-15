import { addAppointmentFB, getAllAppointmentData, getNextAppointmentData, getParentData, editAppointmentFB } from 'actionStore/FirebaseAction/appointmentAction';

import {
    addAppointment,
    displayAppointment,
    filterAppointment,
    cancelFilterAppointment,
    getCustomerAppointment,
    editAppointment,
    requestDisplayAppointment,
    requestDisplayAppointmentClose
} from 'reduxStore/Action/appointmentAction';

export const getAllAppointment = () => async (dispatch) => {
    dispatch(requestDisplayAppointment())
    const appointmentData = await getAllAppointmentData();
    if (appointmentData != null) {
        console.log('----- getAllAppointmentData ------');
        console.log(appointmentData)
        dispatch(displayAppointment(appointmentData))
    } else {
        dispatch(requestDisplayAppointmentClose())
        alert('something went wrong !!')
    }
};

export const getAppointmentPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayAppointment())
    const appointmentData = await getNextAppointmentData(lastVisible);
    if (appointmentData != null) {
        console.log('----- getNextAppointmentData ------');
        console.log(appointmentData)
        dispatch(displayAppointment(appointmentData))
    } else {
        dispatch(requestDisplayAppointmentClose())
        alert('something went wrong !!')
    }
};

export const addAppointmentRequest = (data) => async (dispatch) => {
    const isAppointmentAdd = await addAppointmentFB(data);
    if (isAppointmentAdd != null) {
        getAllAppointment()
        // dispatch(addChild(isChildAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const onFilterData = (date) => async (dispatch) => {
    dispatch(filterAppointment(date))
}

export const onCancelFilterData = () => async (dispatch) => {
    dispatch(cancelFilterAppointment())
}

export const requestCustomerData = (email) => async (dispatch) => {
    const customerData = await getParentData(email)
    if (customerData) {
        dispatch(getCustomerAppointment(customerData))
    } else {
        console.log('something went wrong !!')
        // alert('something went wrong !!')
    }
}

export const editAppointmentRequest = (appointmentId, noti_token, data) => async (dispatch) => {
    const isAppointmentEdit = await editAppointmentFB(appointmentId, noti_token, data);
    if (isAppointmentEdit != null) {
        dispatch(editAppointment({
            appointmentId: appointmentId,
            data: data
        }))
    } else {
        alert('something went wrong !!')
    }
};