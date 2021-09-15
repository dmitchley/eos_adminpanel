import { ADD_DUE_INVOICE, DISPLAY_DUE_INVOICE, GET_CUSTOMER_FOR_DUE, EDIT_DUE_INVOICE, REQ_DISPLAY_DUE_INVOICE, REQ_DISPLAY_DUE_INVOICE_CLOSE } from "./ActionTypes";

export const displayInvoice = (data) => {
    return {
        type: DISPLAY_DUE_INVOICE,
        data: data,
    };
};

export const requestDisplayInvoice = (data) => {
    return {
        type: REQ_DISPLAY_DUE_INVOICE,
    }
};

export const requestDisplayInvoiceClose = (data) => {
    return {
        type: REQ_DISPLAY_DUE_INVOICE_CLOSE,
    }
};

export const addInvoice = (data) => {
    return {
        type: ADD_DUE_INVOICE,
        data: data,
    }
};

export const getCustomerForDue = (data) => {
    return {
        type: GET_CUSTOMER_FOR_DUE,
        data: data,
    }
};

export const editDueinvoice = (data) => {
    return {
        type: EDIT_DUE_INVOICE,
        data: data,
    }
};