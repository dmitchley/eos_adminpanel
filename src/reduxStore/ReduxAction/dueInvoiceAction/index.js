import { addDueInvoiceFB, getAllInvoiceData, getNextInvoiceData, getParentData, editDueinvoiceFB } from 'actionStore/FirebaseAction/dueInvoiceAction';

import {
    addInvoice,
    displayInvoice,
    getCustomerForDue,
    editDueinvoice,
    requestDisplayInvoice,
    requestDisplayInvoiceClose
} from 'reduxStore/Action/dueInvoice';

export const getAllInvoice = () => async (dispatch) => {
    dispatch(requestDisplayInvoice())
    const invoiceData = await getAllInvoiceData();
    if (invoiceData != null) {
        console.log('----- getAllInvoiceData ------');
        console.log(invoiceData)
        dispatch(displayInvoice(invoiceData))
    } else {
        dispatch(requestDisplayInvoiceClose())
        alert('something went wrong !!')
    }
};

export const getInvoicePages = (lastVisible) => async (dispatch) => {
    dispatch(requestDisplayInvoice())
    const invoiceData = await getNextInvoiceData(lastVisible);
    if (invoiceData != null) {
        console.log('----- getNextInvoiceData ------');
        console.log(invoiceData)
        dispatch(displayInvoice(invoiceData))
    } else {
        dispatch(requestDisplayInvoiceClose())
        alert('something went wrong !!')
    }
};

export const addInvoiceRequest = (data) => async (dispatch) => {
    const isAppointmentAdd = await addDueInvoiceFB(data);
    if (isAppointmentAdd != null) {
        getAllInvoice()
        // dispatch(addChild(isChildAdd))
    } else {
        alert('something went wrong !!')
    }
};

export const requestCustomerData = (parentId) => async (dispatch) => {
    const customerData = await getParentData(parentId)
    if (customerData) {
        dispatch(getCustomerForDue(customerData))
    } else {
        alert('something went wrong !!')
    }
}

export const editDueRequest = (invoiceId, data) => async (dispatch) => {
    const isAppointmentEdit = await editDueinvoiceFB(invoiceId, data);
    if (isAppointmentEdit != null) {
        dispatch(editDueinvoice({
            due_invoices_id: invoiceId,
            data: data
        }))
    } else {
        alert('something went wrong !!')
    }
};