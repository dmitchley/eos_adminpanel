import { myFirebase, db } from 'services/firebase';


export const setTokenFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        const { docId, dataStore } = data;
        db.collection("admin")
            .doc(docId)
            .update(dataStore)
            .then(function (docRef) {
                resolve(data);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}