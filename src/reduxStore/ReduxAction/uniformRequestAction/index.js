import { getTotalSizeofRequest, getInitialRequestData, getNextRequestData, uniformCountListener, getTotalUnReadCount } from 'actionStore/FirebaseAction/uniformRequestAction';

import {
    displayRequest,
    requestDisplayUniform,
    requestDisplayUniformClose,
    displayUniformNotiCount
} from 'reduxStore/Action/uniformRequestAction';

export const getInitialRequest = () => async (dispatch) => {
    dispatch(requestDisplayUniform())
    const requestData = await getInitialRequestData();
    if (requestData != null) {
        console.log('----- getInitialRequest ------');
        console.log(requestData)
        dispatch(displayRequest(requestData))
    } else {
        dispatch(requestDisplayUniformClose())
        alert('something went wrong !!')
    }
};

export const getRequestPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayUniform())
    const requestData = await getNextRequestData(lastVisible);
    if (requestData != null) {
        console.log('----- getRequestPages ------');
        console.log(requestData)
        dispatch(displayRequest(requestData))
    } else {
        dispatch(requestDisplayUniformClose())
        alert('something went wrong !!')
    }
};

// export const initialUniformNotiListener = (notiCount) => async (dispatch) => {
//     // dispatch(displayUniformNotiCount(notiCount))
//     const getInitialNotiCount = await getTotalUnReadCount();
//     console.log('------ initialUniformNotiListener -----');
//     console.log(getInitialNotiCount)
//     if(getInitialNotiCount) {
//         dispatch(displayUniformNotiCount(getInitialNotiCount));
//         // dispatch(uniformNotiListener)
//     }
// }

export const uniformNotiListener = (notiCount) => async (dispatch) => {
     dispatch(displayUniformNotiCount(notiCount))
    // console.log('----- calll uniformNotiListener -------')
    // const getNotiCount = await uniformCountListener();
    // if(getNotiCount) {
    //     dispatch(displayUniformNotiCount(getNotiCount));
    // }
}