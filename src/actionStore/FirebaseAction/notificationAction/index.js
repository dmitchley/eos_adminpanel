import { myFirebase, db, serverKey } from 'services/firebase';
import axios from 'axios';
import _ from 'lodash'

const onePageCount = 20;

export const addNotificationFB = (data) => {
    return new Promise(async (resolve, reject) => {
        const generatedDocId = await firestoreAutoId();
        db.collection("notification")
            .doc(generatedDocId)
            .set({ noti_id: generatedDocId, ...data })
            .then(async (docRef) => {
                const isSendNotification = await sendNotification({ ...data, noti_id: generatedDocId });
                if (isSendNotification) {
                    resolve({ ...data });
                }
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

const sendNotification = (data) => {
    return new Promise(async (resolve) => {
        const { noti_title, noti_body, noti_id } = data;
        const notificationTokenArray = await getAllNotification();
        const validateTokenArray = _.compact(notificationTokenArray);

        axios
            .post(
                "https://fcm.googleapis.com/fcm/send",
                {
                    "notification": {
                        "title": noti_title,
                        "body": noti_body
                    },
                    "data": {
                        "type": "General",
                        "noti_id": String(noti_id).trim()

                    },
                    "registration_ids": validateTokenArray
                },
                {
                    'headers': {
                        "Content-Type": "application/json",
                        'Authorization':
                            `key=${serverKey}`
                    }
                }
            )
            .then(response => {
                console.log("response" + response);
                alert('Notification sent successful')
            })
            .catch(error => {
                console.log(error);
            });
    })

}

const getAllNotification = () => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .get()
            .then((data) => {
                let response = [];
                data.forEach((doc, index) => {
                    const parentData = doc.data();
                    const { noti_token } = parentData;
                    response.push(noti_token);
                });
                resolve(response);
            })
    })
}

export const getTotalSizeofNotifications = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("notification")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const getAllNotificationData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("notification")
            .orderBy('created_at', 'desc')
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];
                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        arr.push({ id: doc.id, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getNextNotificationData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        await db.collection("notification")
            .orderBy('created_at', 'desc')
            .startAfter(lastVisible.created_at)
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        arr.push({ id: doc.id, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getParentData = (parent_id) => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .doc(parent_id)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const firestoreAutoId = () => {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''

    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(
            Math.floor(Math.random() * CHARS.length)
        )
    }
    return autoId
}
