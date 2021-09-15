import { getAdminCredential } from 'actionStore/FirebaseAction/authAction'

import {
    receiveLogin,
    loginError,
    requestLogout
} from '../../Action/authAction';
import { storeToken, removeStoreToken } from 'reduxStore/ReduxAction/fcmAction';

export const loginAdmin = (email, password) => async (dispatch) => {
    const adminCredential = await getAdminCredential();
    if (String(email).trim() === String(adminCredential.email).trim() && password === adminCredential.password) {
        await localStorage.setItem('isLogin', 'true');
        dispatch(receiveLogin(true))
        dispatch(storeToken())
    } else {
        dispatch(loginError());
        alert('email or password must be wrong !!')
    }
};

export const logoutAdmin = () => async (dispatch) => {
    try {
        await localStorage.removeItem("isLogin");
        dispatch(removeStoreToken())
        dispatch(requestLogout())
    } catch (error) {
        alert('something went wrong !!')
    }
};

export const verifyAuth = () => async (dispatch) => {
    const isLogin = await localStorage.getItem('isLogin');
    if (isLogin != null) {
        dispatch(receiveLogin(true))
    }
};