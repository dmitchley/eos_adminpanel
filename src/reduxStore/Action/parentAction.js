import { ADD_PARENT, EDIT_PARENT, DISPLAY_PARENT, IMPORT_PARENT_START, IMPORT_PARENT_FINISH, REQ_DISPLAY_PARENT, REQ_DISPLAY_PARENT_CLOSE } from "./ActionTypes";

export const displayParent = (data) => {
    return {
        type: DISPLAY_PARENT,
        data: data,
    };
};

export const requestDisplayParent = (data) => {
    return {
        type: REQ_DISPLAY_PARENT,
    }
};

export const requestDisplayParentClose = (data) => {
    return {
        type: REQ_DISPLAY_PARENT_CLOSE,
    }
};

export const addParent = (data) => {
    return {
        type: ADD_PARENT,
        data: data,
    }
};

export const editParent = (data) => {
    return {
        type: EDIT_PARENT,
        data: data,
    }
};

export const startImport = (data) => {
    return {
        type: IMPORT_PARENT_START,
    }
};

export const finishImport = (data) => {
    return {
        type: IMPORT_PARENT_FINISH,
        data: data,
    }
};