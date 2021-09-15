import { myFirebase, db, serverKey } from 'services/firebase';
import axios from 'axios';

const onePageCount = 20;

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

export const addDueInvoiceFB = (data) => {
    return new Promise(async (resolve, reject) => {
        const generatedDocId = await firestoreAutoId();
        const { noti_token, payload } = data;
        db.collection("due_invoices")
            .doc(generatedDocId)
            .set({ due_invoices_id: generatedDocId, invoice_no: generatedDocId, ...payload })
            .then(function (docRef) {
                resolve({ ...data });
                sendNotification(generatedDocId, noti_token)
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

const sendNotification = (DocId, noti_token) => {
    return new Promise(async (resolve) => {
        axios
            .post(
                "https://fcm.googleapis.com/fcm/send",
                {
                    "notification": {
                        "title": "Due Invoice",
                        "body": "Your invoice is due"
                    },
                    "data": {
                        "type": "DueInvoice"
                    },
                    "to": noti_token
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

export const getTotalSizeofInvoice = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("due_invoices")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const getClassData = (classId) => {
    return new Promise(async (resolve) => {
        await db.collection("classes")
            .doc(classId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getChildData = (childId) => {
    return new Promise(async (resolve) => {
        await db.collection("children")
            .doc(childId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getParentData = (parentId) => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .doc(parentId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getAllInvoiceData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("due_invoices")
            .orderBy('invoice_no', 'asc')
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];
                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const { class_id, parent_id, children_id } = data;
                        const classData = await getClassData(class_id);
                        const childData = await getChildData(children_id);
                        const parentData = await getParentData(parent_id);

                        const childDataObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        const parentDataObj = {
                            parentName: parentData.firstName + ' ' + parentData.lastName,
                        }

                        arr.push({ id: doc.id, ...classData, ...childDataObj, ...parentDataObj, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getNextInvoiceData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        await db.collection("due_invoices")
            .orderBy('invoice_no', 'asc')
            .startAfter(lastVisible.invoice_no)
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const { class_id, parent_id, children_id } = data;
                        const classData = await getClassData(class_id);
                        const childData = await getChildData(children_id);
                        const parentData = await getParentData(parent_id);

                        const childDataObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        const parentDataObj = {
                            parentNAme: parentData.firstName + ' ' + parentData.lastName,
                        }

                        arr.push({ id: doc.id, ...classData, ...childDataObj, ...parentDataObj, ...data });
                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getAllParentData = () => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .get()
            .then((data) => {
                let response = [];
                data.forEach((doc) => {
                    const parentData = doc.data();
                    const { firstName, lastName, email, parent_id } = parentData;
                    const responseData = {
                        parentName: firstName + ' ' + lastName,
                        email: email,
                        parent_id: parent_id
                    }
                    response.push(responseData)
                });

                resolve(response);
            })
    })
}

export const getParentChild = (parentId) => {
    return new Promise(async (resolve) => {
        await db.collection("children")
            .where('parent_id', '==', parentId)
            .get()
            .then((querySnapshot) => {
                const arr = [];

                querySnapshot.docs.map((doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr);
            })
    })
}

export const editDueinvoiceFB = async (invoiceID, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("due_invoices")
            .doc(invoiceID)
            .update(data)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}