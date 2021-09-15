import { getAllReqCatchupData, getNextReqCatchData, editRequestCatchupFB } from 'actionStore/FirebaseAction/requestCatchupAction';

import {
    displayRequestCatch,
    editRequestCatch,
    requestDisplayCatch,
    requestDisplayCatchClose,
    displayReqCatchNotiCount
} from 'reduxStore/Action/requestCatchupAction';

export const getAllReqCatchup = () => async (dispatch) => {
    dispatch(requestDisplayCatch())
    const reqCatchData = await getAllReqCatchupData();
    if (reqCatchData != null) {
        console.log('----- getAllReqCatchupData ------');
        console.log(reqCatchData)
        dispatch(displayRequestCatch(reqCatchData))
    } else {
        dispatch(requestDisplayCatchClose())
        alert('something went wrong !!')
    }
};

export const getReqCatchupPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayCatch())
    const reqCatchData = await getNextReqCatchData(lastVisible);
    if (reqCatchData != null) {
        console.log('----- getNextReqCatchData ------');
        console.log(reqCatchData)
        dispatch(displayRequestCatch(reqCatchData))
    } else {
        dispatch(requestDisplayCatchClose())
        alert('something went wrong !!')
    }
};

export const editRequestCatchupReq = (catchupId, data) => async (dispatch) => {
    const isAppointmentEdit = await editRequestCatchupFB(catchupId, data);
    if (isAppointmentEdit != null) {
        dispatch(editRequestCatch({
            req_catch_class_id: catchupId,
            data: data
        }))
    } else {
        alert('something went wrong !!')
    }
};

export const reqCatchNotiListener = (notiCount) => async (dispatch) => {
     dispatch(displayReqCatchNotiCount(notiCount))
}