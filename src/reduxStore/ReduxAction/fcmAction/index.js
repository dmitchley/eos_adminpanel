import _ from 'lodash';
import { askForPermissionToReceiveNotifications } from 'services/firebase';
import { getAdminCredential } from 'actionStore/FirebaseAction/authAction';
import { setTokenFB } from 'actionStore/FirebaseAction/fcmAction';
import {
    requestToken,
} from '../../Action/fcmAction';

const getUniqueRecord = (data) => {
    return _.uniqBy(data);
}

export const storeToken = () => async (dispatch) => {
    const device_Token = await askForPermissionToReceiveNotifications();
    const adminCredential = await getAdminCredential();

    const { token, admin_id } = adminCredential;

    const tokenArray = [...token, device_Token];
    const validateTokenArray = getUniqueRecord(tokenArray)
    const dataStoredFB = await setTokenFB({
        docId: admin_id,
        dataStore: { token: validateTokenArray }
    })
    if (dataStoredFB.length > 0) {
        dispatch(requestToken(dataStoredFB))
    }

};

export const removeStoreToken = () => async (dispatch) => {
    const device_Token = await askForPermissionToReceiveNotifications();
    const adminCredential = await getAdminCredential();

    const { token, id } = adminCredential;

    const tokenArray = token.filter((item) => item !== device_Token);
    const validateTokenArray = getUniqueRecord(tokenArray)
    const dataStoredFB = await setTokenFB({
        docId: id,
        dataStore: { token: validateTokenArray }
    })
    if (dataStoredFB.length > 0) {
        dispatch(requestToken(dataStoredFB))
    }

};