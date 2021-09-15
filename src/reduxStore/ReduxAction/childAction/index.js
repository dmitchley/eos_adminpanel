import { addChildFB, getAllChildrenData, getNextChildrenData, importChildFB, editChildFB, deleteChildFB } from 'actionStore/FirebaseAction/childAction';

import {
    addChild,
    displayChild,
    startChildImport,
    finishChildImport,
    editChild,
    deleteChild,
    requestDisplayChild,
    requestDisplayChildClose
} from 'reduxStore/Action/childAction';

export const getAllChildren = () => async (dispatch) => {
    console.log('---- on child -----')
    dispatch(requestDisplayChild())
    const childrenData = await getAllChildrenData();
    if (childrenData != null) {
        console.log('----- getAllChildrenData ------');
        console.log(childrenData)
        dispatch(displayChild(childrenData))
    } else {
        dispatch(requestDisplayChildClose())
        alert('something went wrong !!')
    }
};

export const getChildrenPages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayChild())
    const childrenData = await getNextChildrenData(lastVisible);
    if (childrenData != null) {
        console.log('----- getAllChildrenData ------');
        console.log(childrenData)
        dispatch(displayChild(childrenData))
    } else {
        dispatch(requestDisplayChildClose())
        alert('something went wrong !!')
    }
};

export const addChildrenRequest = (data) => async (dispatch) => {
    const isChildAdd = await addChildFB(data);
    if (isChildAdd != null) {
        getAllChildren()
        // dispatch(addChild(isChildAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const editChildRequest = (childId, data) => async (dispatch) => {
    const isChildEdit = await editChildFB(childId, data);
    if (isChildEdit != null) {
        dispatch(editChild({
            childId: childId,
            data: data
        }))
    } else {
        alert('something went wrong !!')
    }
};

export const deleteChildrenRequest = (childId) => async (dispatch) => {
    const isChildDelete = await deleteChildFB(childId);
    if (isChildDelete != null) {
        // getAllChildren()
        dispatch(deleteChild(isChildDelete))
    } else {
        alert('something went wrong !!')
    }
};

export const importChildRequest = (data) => async (dispatch) => {
    dispatch(startChildImport())
    const isImportChild = await importChildFB(data);
    if (isImportChild) {
        // dispatch(addParent(isParentAdd))
        getAllChildrenData()
        dispatch(finishChildImport())
    } else {
        alert('something went wrong !!')
    }
};
