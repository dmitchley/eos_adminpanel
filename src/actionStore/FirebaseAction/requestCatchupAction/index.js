import { myFirebase, db } from 'services/firebase';
import { getClassList, getLocationList, getStaffList }  from 'actionStore/FirebaseAction/appointmentAction';
import _ from 'lodash';

const onePageCount = 10;

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

export const getTotalSizeofReqCatchup = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("request_catchup_class")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

const getClassData = (classId) => {
    return new Promise(async (resolve) => {
        await db.collection("classes")
            .doc(classId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

const getLocationData = (locationId) => {
    return new Promise(async (resolve) => {
        await db.collection("location")
            .doc(locationId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

const getTeacherData = (teacherId) => {
    return new Promise(async (resolve) => {
        await db.collection("teacher")
            .doc(teacherId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

const getChildData = (children_id) => {
    return new Promise(async (resolve) => {
        await db.collection("children")
            .doc(children_id)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getAllReqCatchupData = async () => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();
        db.collection("request_catchup_class")
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
                        const { class_id, location_id, teacher_id, children_id } = data;
                        const classData = _.filter(classList, item => item.class_id === class_id);
                        const locationData = _.filter(locationList, item => item.location_id === location_id);
                        const teacherData = _.filter(staffList, item => item.teacher_id === teacher_id);
                        const childData = await getChildData(children_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        const childObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        arr.push({ id: doc.id, ...classData[0], ...locationData[0], ...childObj, ...teacherDataObj, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getNextReqCatchData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();
        await db.collection("request_catchup_class")
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
                        const { class_id, location_id, teacher_id, children_id } = data;
                        const classData = _.filter(classList, item => item.class_id === class_id);
                        const locationData = _.filter(locationList, item => item.location_id === location_id);
                        const teacherData = _.filter(staffList, item => item.teacher_id === teacher_id);
                        const childData = await getChildData(children_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        const childObj = {
                            childName: childData.fname + ' ' + childData.lname,
                        }

                        arr.push({ id: doc.id, ...classData[0], ...locationData[0], ...childObj, ...teacherDataObj, ...data });
                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const editRequestCatchupFB = async (catchupId, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("request_catchup_class")
            .doc(catchupId)
            .update(data)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const updateReadCountById = async (reqCatchId, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("request_catchup_class")
            .doc(reqCatchId)
            .update(data)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const setReadStatusForReqCatchNoti = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("request_catchup_class")
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
                        resolve(true);
                    }
                });

            });
    })
}