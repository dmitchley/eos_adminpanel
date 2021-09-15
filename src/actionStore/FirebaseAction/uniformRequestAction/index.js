import { myFirebase, db } from 'services/firebase';
// import { store } from 'reduxStore/configureStore';
import { displayUniformNotiCount, displayUniformNotiCount2 } from 'reduxStore/Action/uniformRequestAction';
import { createStore } from 'redux';
import uniformReducer from 'reduxStore/Reducer/uniformReducer';

const onePageCount = 20;

// const store = createStore(uniformReducer);

export const getTotalSizeofRequest = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("uniform_request")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const getInitialRequestData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("uniform_request")
            .orderBy('created_at', 'desc')
            .limit(onePageCount)
            .get()
            .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const { children_id, parent_id } = data;
                        const childData = await getChildData(children_id);
                        const parentData = await getParentData(parent_id);

                        const parentObj = {
                            parentName: parentData.firstName + ' ' + parentData.lastName,
                        }

                        const childObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        arr.push({ id: doc.id, ...parentObj, ...childObj, ...data });
                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    })
                }
            })
    })
}

const getChildData = (childId) => {
    return new Promise((resolve, reject) => {
        db.collection("children")
            .doc(childId)
            .get()
            .then((querySnapshot) => {
                let Data = querySnapshot.data();
                resolve(Data)
            })
    })
}

const getParentData = (parentId) => {
    return new Promise((resolve, reject) => {
        db.collection("parents")
            .doc(parentId)
            .get()
            .then((querySnapshot) => {
                let Data = querySnapshot.data();
                resolve(Data)
            })
    })
}

export const getNextRequestData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        await db.collection("uniform_request")
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
                        const { children_id, parent_id } = data;
                        const childData = await getChildData(children_id);
                        const parentData = await getParentData(parent_id);

                        const parentObj = {
                            parentName: parentData.firstName + ' ' + parentData.lastName,
                        }

                        const childObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        arr.push({ id: doc.id, ...parentObj, ...childObj, ...data });
                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    })
                }
            })
    })
}

export const getTotalUnReadCount = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("uniform_request")
            .where('isNotiRead', '==', false)
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const uniformCountListener = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        db.collection('uniform_request')
            .onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(async change => {
                    console.log('---- uniformCountListener ------')
                    console.log(change.type)
                    if (change.type === 'added') {
                        // store.dispatch(displayUniformNotiCount2(1))
                        // resolve(1)
                    }
                    if (change.type === 'modified') {
                        resolve(-1)
                    }
                });
            });
    })
}

export const updateReadCountById = async (uniformId, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("uniform_request")
            .doc(uniformId)
            .update(data)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const setReadStatusForUniformNoti = async (data) => {
    return new Promise(async (resolve, reject) => {
        // const batch = db.batch();

        // Update the population of 'SF'
        // const sfRef = db.collection('uniform_request').doc('false');
        // batch.update(sfRef, { isNotiRead: true });

        // // Commit the batch
        // await batch.commit();


        db.collection("uniform_request")
            .where('isNotiRead', '==', false)
            .get()
            .then((querySnapshot) => {
                // resolve(querySnapshot.size)
                const arr = [];
                querySnapshot.docs.map(async (doc, index) => {
                    const data = doc.data();

                    const isStatusUpdate = await updateReadCountById(doc.id, { isNotiRead: true });

                    if(isStatusUpdate) {
                        arr.push({ id: doc.id, ...data });
                    }

                    if (index == (querySnapshot.docs.length - 1)) {
                        // resolve(arr);
                        resolve(true);
                    }
                });

            });
    })
}