import { ADD_CHILDREN, DISPLAY_CHILDREN, IMPORT_CHILDREN_START, IMPORT_CHILDREN_FINISH, EDIT_CHILDREN, DELETE_CHILDREN, REQ_DISPLAY_CHILDREN, REQ_DISPLAY_CHILDREN_CLOSE } from "./ActionTypes";

export const displayChild = (data) => {
    return {
        type: DISPLAY_CHILDREN,
        data: data,
    };
};

export const requestDisplayChild = (data) => {
    return {
        type: REQ_DISPLAY_CHILDREN,
    }
};

export const requestDisplayChildClose = (data) => {
    return {
        type: REQ_DISPLAY_CHILDREN_CLOSE,
    }
};

export const addChild = (data) => {
    return {
        type: ADD_CHILDREN,
        data: data,
    }
};

export const editChild = (data) => {
    return {
        type: EDIT_CHILDREN,
        data: data,
    }
};

export const deleteChild = (data) => {
    return {
        type: DELETE_CHILDREN,
        data: data,
    }
};

export const startChildImport = (data) => {
    return {
        type: IMPORT_CHILDREN_START,
    }
};

export const finishChildImport = (data) => {
    return {
        type: IMPORT_CHILDREN_FINISH,
        data: data
    }
};