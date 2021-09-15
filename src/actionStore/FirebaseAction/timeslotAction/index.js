import { myFirebase, db } from 'services/firebase';
import { getStaffList } from 'actionStore/FirebaseAction/appointmentAction';
import _ from 'lodash';

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

export const getClassList = () => {
    return new Promise(async (resolve, reject) => {
        db.collection("classes")
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                querySnapshot.docs.map(async (doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr);
            })
    })
}

export const getLocationList = () => {
    return new Promise(async (resolve, reject) => {
        db.collection("location")
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                querySnapshot.docs.map(async (doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr);
            })
    })
}

export const getTeacherList = () => {
    return new Promise(async (resolve, reject) => {
        db.collection("teacher")
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                querySnapshot.docs.map(async (doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr);
            })
    })
}

export const getExistedTimeSlotList = () => {
    return new Promise(async (resolve, reject) => {
        db.collection("class_timeslot")
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                querySnapshot.docs.map(async (doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr);
            })
    })
}

const validateAddTimeSlot = async (data) => {
    return new Promise(async (resolve, reject) => {
        const { 
            class_id,
            location_id,
            teacher_id,
            start_time,
            day
        } = data;
        db.collection("class_timeslot")
            .where('class_id', '==', class_id)
            .where('location_id', '==', location_id)
            .where('teacher_id', '==', teacher_id)
            .where('start_time', '==', start_time)
            .where('day', '==', day)
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    querySnapshot.docs.map(async (doc) => {
                        arr.push({ id: doc.id, ...doc.data() })
                    });
                    resolve(arr);
                }
            })
    })
}

export const addTimeSlotFB = (data) => {
    return new Promise(async (resolve, reject) => {
        const generatedDocId = await firestoreAutoId();
        const isDataExist = await validateAddTimeSlot(data);
        if(isDataExist.length > 0) {
            // resolve({});
            alert('TimeSlot already book for this day!!')
        } else {
            db.collection("class_timeslot")
            .doc(generatedDocId)
            .set({ timeslot_id: generatedDocId, ...data })
            .then(function (docRef) {
                resolve({ ...data });
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
        }
    })
}

export const getTotalSizeofTimeSlot = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("class_timeslot")
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

export const getAllTimeSlotData = async () => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();
        db.collection("class_timeslot")
            .orderBy('timeslot_id', 'asc')
            // .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];
                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const { class_id, location_id, teacher_id, timeslot_id } = data;
                        const classData = _.filter(classList, item => item.class_id === class_id);
                        const locationData = _.filter(locationList, item => item.location_id === location_id);
                        const teacherData = _.filter(staffList, item => item.teacher_id === teacher_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        arr.push({ id: timeslot_id, ...classData[0], ...locationData[0], ...teacherDataObj, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getNextTimeSlotData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();
        await db.collection("class_timeslot")
            .orderBy('timeslot_id', 'asc')
            .startAfter(lastVisible.timeslot_id)
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const { class_id, location_id, teacher_id, timeslot_id } = data;
                        const classData = _.filter(classList, item => item.class_id === class_id);
                        const locationData = _.filter(locationList, item => item.location_id === location_id);
                        const teacherData = _.filter(staffList, item => item.teacher_id === teacher_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        arr.push({ id: timeslot_id, ...classData[0], ...locationData[0], ...teacherDataObj, ...data });

                        if (index === (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const importTimeSlotFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();
        data.forEach((item, index) => {
            // const class_id = item[`class_id`];
            // const day = item[`Day`];
            // const duration = item[`Duration`];
            // const location_id = item[`location_id`];
            // const start_time = item[`StartTime`];
            // const teacher_id = item[`teacher_id`];

            // const timeSlotObj = {
            //     class_id,
            //     day,
            //     duration,
            //     location_id,
            //     start_time,
            //     teacher_id,
            // }

            const docRef = db.collection('class_timeslot').doc();
            arr.push({ ...item, timeslot_id: docRef.id })
            batch.set(docRef, { ...item, timeslot_id: docRef.id });
        })

        await batch.commit().then(() => {
            resolve(arr)
        })
    })
}

export const importClasses = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();

        data.forEach((item, index) => {
            const docRef = db.collection('classes').doc();
            arr.push({ ...item, class_id: docRef.id })
            batch.set(docRef, { ...item, class_id: docRef.id });
        })

        await batch.commit().then(() => {
            // resolve(arr)
            resolve(true)
        })
    })
}

export const importClassStaff = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();

        data.forEach((item, index) => {
            const staffDataObj = {
                email: item.email,
                fname: item.fname,
                lname: item.lname
            }

            const docRef = db.collection('teacher').doc();
            arr.push({ ...staffDataObj, teacher_id: docRef.id })
            batch.set(docRef, { ...staffDataObj, teacher_id: docRef.id });
        })

        await batch.commit().then(() => {
            // resolve(arr)
            resolve(true)
        })
    })
}

export const importClassLocation = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();

        data.forEach((item, index) => {
            const docRef = db.collection('location').doc();
            arr.push({ ...item, location_id: docRef.id })
            batch.set(docRef, { ...item, location_id: docRef.id });
        })

        await batch.commit().then(() => {
            // resolve(arr)
            resolve(true)
        })
    })
}