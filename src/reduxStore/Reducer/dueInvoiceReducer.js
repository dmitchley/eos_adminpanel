import { ADD_DUE_INVOICE, DISPLAY_DUE_INVOICE, GET_CUSTOMER_FOR_DUE, EDIT_DUE_INVOICE, REQ_DISPLAY_DUE_INVOICE, REQ_DISPLAY_DUE_INVOICE_CLOSE } from '../Action/ActionTypes';

import _ from 'lodash';
import { getTotalSizeofParent } from 'actionStore/FirebaseAction/parentAction';

const INITIAL_STATE = {
    dueInvoiceData: [],
    customerData: {},
    isGetInitialData: false,
    showDueInvoiceLoader: false
};

const getUniqueRecord = (data) => {
    return _.uniqBy(data, 'id');
}

const dueInvoiceReducer = (state = INITIAL_STATE, action) => {
    const { dueInvoiceData } = state;
    switch (action.type) {
        case DISPLAY_DUE_INVOICE:
            return {
                ...state,
                isGetInitialData: true,
                showDueInvoiceLoader: false,
                dueInvoiceData: getUniqueRecord([...dueInvoiceData, ...action.data])
            };
        case ADD_DUE_INVOICE:
            dueInvoiceData.push(action.data);
            return {
                ...state,
                dueInvoiceData: getUniqueRecord([...dueInvoiceData])
            };
        case GET_CUSTOMER_FOR_DUE:
            return {
                ...state,
                customerData: action.data
            };
        case EDIT_DUE_INVOICE:
            const index = dueInvoiceData.findIndex(post => post.due_invoices_id === action.data.due_invoices_id);
            const updateDueinvoice = [
                ...dueInvoiceData.slice(0, index), // everything before current post
                {
                    ...dueInvoiceData[index],
                    ...action.data.data
                },
                ...dueInvoiceData.slice(index + 1), // everything after current post
            ]

            return {
                ...state,
                dueInvoiceData: updateDueinvoice
            }
        case REQ_DISPLAY_DUE_INVOICE:
            return {
                ...state,
                showDueInvoiceLoader: true
            };
        case REQ_DISPLAY_DUE_INVOICE_CLOSE:
            return {
                ...state,
                showDueInvoiceLoader: false
            };
        default:
            return state;
    }
}
export default dueInvoiceReducer;