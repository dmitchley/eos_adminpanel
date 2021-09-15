import { addTimeSlotFB, getAllTimeSlotData, getNextTimeSlotData, importTimeSlotFB } from 'actionStore/FirebaseAction/timeslotAction';

import {
    addTimeSlot,
    displayTimeSlot,
    startTimeSlotImport,
    finishTimeSlotImport,
    requestDisplayTimeslot,
    requestDisplayTimeslotClose
} from 'reduxStore/Action/timeSlotAction';

export const getAllTimeSlot = () => async (dispatch) => {
    dispatch(requestDisplayTimeslot())
    const timeSlotData = await getAllTimeSlotData();
    if (timeSlotData != null) {
        console.log('----- getAllTimeSlotData ------');
        console.log(timeSlotData)
        dispatch(displayTimeSlot(timeSlotData))
    } else {
        dispatch(requestDisplayTimeslotClose())
        alert('something went wrong !!')
    }
};

export const getTimeSlotPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayTimeslot())
    const timeSlotData = await getNextTimeSlotData(lastVisible);
    if (timeSlotData != null) {
        console.log('----- getAllChildrenData ------');
        console.log(timeSlotData)
        dispatch(displayTimeSlot(timeSlotData))
    } else {
        dispatch(requestDisplayTimeslotClose())
        alert('something went wrong !!')
    }
};

export const addTimeSlotRequest = (data) => async (dispatch) => {
    const isTimeSlotAdd = await addTimeSlotFB(data);
    if (isTimeSlotAdd != null) {
        getAllTimeSlot()
        // dispatch(addChild(isChildAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const importTimeSlotRequest = (data) => async (dispatch) => {
    return new Promise(async (resolve) => {
        dispatch(startTimeSlotImport())
        const isImportTimeSlot = await importTimeSlotFB(data);
        if (isImportTimeSlot) {
            // dispatch(addParent(isParentAdd))
            dispatch(getAllTimeSlot())
            dispatch(finishTimeSlotImport(isImportTimeSlot))
            resolve(true)
        } else {
            resolve(true)
            // alert('something went wrong !!')
        }
    })
};
