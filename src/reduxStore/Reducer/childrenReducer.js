import { ADD_CHILDREN, DISPLAY_CHILDREN, EDIT_CHILDREN, DELETE_CHILDREN, IMPORT_CHILDREN_START, IMPORT_CHILDREN_FINISH, REQ_DISPLAY_CHILDREN, REQ_DISPLAY_CHILDREN_CLOSE } from '../Action/ActionTypes';
import _ from 'lodash';
import { getTotalSizeofParent } from 'actionStore/FirebaseAction/parentAction';

const INITIAL_STATE = {
    childrenData: [],
    isImportChildData: false,
    isGetInitialData: false,
    showChildLoader: false
};

const getUniqueRecord = (data) => {
    return _.uniqBy(data, 'id');
}

const childrenReducer = (state = INITIAL_STATE, action) => {
    const { childrenData } = state;
    switch (action.type) {
        case DISPLAY_CHILDREN:
            // return [...state, action.data];
            return {
                ...state,
                isGetInitialData: true,
                showChildLoader: false,
                childrenData: getUniqueRecord([...childrenData, ...action.data])
            };
        case ADD_CHILDREN:
            childrenData.push(action.data);
            return {
                ...state,
                childrenData: getUniqueRecord([...childrenData])
            };
        // return [...state, action.payload];
        case EDIT_CHILDREN:
            const index = childrenData.findIndex(post => post.children_id === action.data.childId);
            const updateChildData = [
                ...childrenData.slice(0, index), // everything before current post
                {
                    ...childrenData[index],
                    ...action.data.data
                },
                ...childrenData.slice(index + 1), // everything after current post
            ]

            return {
                ...state,
                childrenData: updateChildData
            }
        case DELETE_CHILDREN:
            return {
                ...state,
                childrenData: childrenData.filter(item => item.children_id !== action.data)
            };
        case IMPORT_CHILDREN_START:
            return {
                ...state,
                isImportChildData: true
            };
        case IMPORT_CHILDREN_FINISH:
            return {
                ...state,
                isImportChildData: false,
                // childrenData: getUniqueRecord([...childrenData, ...action.data])
            };
        case REQ_DISPLAY_CHILDREN:
            return {
                ...state,
                showChildLoader: true
            };
        case REQ_DISPLAY_CHILDREN_CLOSE:
            return {
                ...state,
                showChildLoader: false
            };
        default:
            return state;
    }
}
export default childrenReducer;