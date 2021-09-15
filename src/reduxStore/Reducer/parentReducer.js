import { ADD_PARENT, EDIT_PARENT, DISPLAY_PARENT, IMPORT_PARENT_START, IMPORT_PARENT_FINISH, REQ_DISPLAY_PARENT, REQ_DISPLAY_PARENT_CLOSE } from '../Action/ActionTypes';
import _ from 'lodash';
import { getTotalSizeofParent } from 'actionStore/FirebaseAction/parentAction';

const INITIAL_STATE = {
    parentData: [],
    showParentLoader: false,
    isImportData: false,
    isGetInitialData: false
};

const getUniqueRecord = (data) => {
    return _.uniqBy(data, 'id');
}

const parentReducer = (state = INITIAL_STATE, action) => {
    const { parentData } = state;
    switch (action.type) {
        case DISPLAY_PARENT:
            // return [...state, action.data];
            return {
                ...state,
                isGetInitialData: true,
                showParentLoader: false,
                parentData: getUniqueRecord([...parentData, ...action.data])
            };
        case ADD_PARENT:
            parentData.push(action.data);
            return {
                ...state,
                parentData: getUniqueRecord([...parentData])
            };
        // return [...state, action.payload];
        case EDIT_PARENT:
            const index = parentData.findIndex(post => post.parent_id === action.data.parentId);
            const updateParentData = [
                ...parentData.slice(0, index), // everything before current post
                {
                    ...parentData[index],
                    ...action.data.data
                },
                ...parentData.slice(index + 1), // everything after current post
            ]

            return {
                ...state,
                parentData: updateParentData
            }
        case IMPORT_PARENT_START:
            return {
                ...state,
                isImportData: true
            };
        case IMPORT_PARENT_FINISH:
            return {
                ...state,
                isImportData: false,
                // parentData: getUniqueRecord([...parentData, ...action.data])
            };
        case REQ_DISPLAY_PARENT:
            return {
                ...state,
                showParentLoader: true
            };
        case REQ_DISPLAY_PARENT_CLOSE:
            return {
                ...state,
                showParentLoader: false
            };
        default:
            return state;
    }
}
export default parentReducer;