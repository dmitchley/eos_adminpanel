import { addParentFB, editParentFB, getAllParentsData, getNextParentsData, importParentFB } from 'actionStore/FirebaseAction/parentAction';

import {
    addParent,
    editParent,
    displayParent,
    startImport,
    finishImport,
    requestDisplayParent,
    requestDisplayParentClose
} from 'reduxStore/Action/parentAction';

export const getAllParents = () => async (dispatch) => {
    dispatch(requestDisplayParent())
    const parentData = await getAllParentsData();
    if (parentData != null) {
        console.log('----- getAllParents ------');
        console.log(parentData)
        dispatch(displayParent(parentData))
    } else {
        dispatch(requestDisplayParentClose())
        alert('something went wrong !!')
    }
};

export const getParentsPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayParent())
    const parentData = await getNextParentsData(lastVisible);
    if (parentData != null) {
        console.log('----- getAllParents ------');
        console.log(parentData)
        dispatch(displayParent(parentData))
    } else {
        dispatch(requestDisplayParentClose())
        alert('something went wrong !!')
    }
};

export const addParentRequest = (data) => async (dispatch) => {
    const isParentAdd = await addParentFB(data);
    if (isParentAdd != null) {
        dispatch(addParent(isParentAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const editParentRequest = (parentId, data) => async (dispatch) => {
    const isParentEdit = await editParentFB(parentId, data);
    if (isParentEdit != null) {
        dispatch(editParent({
            parentId: parentId,
            data: isParentEdit
        }))
    } else {
        alert('something went wrong !!')
    }
};

export const importParentRequest = (data) => async (dispatch) => {
    return new Promise(async (resolve) => {
        dispatch(startImport())
        const isImportParent = await importParentFB(data);
        if (isImportParent) {
            // dispatch(addParent(isParentAdd))
            // getAllParents()
            dispatch(finishImport(isImportParent))
            resolve(true)
        } else {
            resolve(true)
            // alert('something went wrong !!')
        }
    })
};
