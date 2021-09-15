import { myFirebase, db, serverKey } from 'services/firebase';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

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

export const addAppointmentFB = (data) => {
    return new Promise(async (resolve, reject) => {
        const generatedDocId = await firestoreAutoId();
        const { noti_token, payload } = data;

        const isValidData = await validateAddAppointment(payload);
        if (isValidData.length > 0) {
            alert('Your appoint for this data is already exist!!');
            // resolve({});
        } else {
            db.collection("booking")
                .doc(generatedDocId)
                .set({ booking_id: generatedDocId, ...payload })
                .then(function (docRef) {
                    resolve({ ...data });
                    sendAppointmentNotification(generatedDocId, noti_token, false)
                })
                .catch(function (error) {
                    console.error("Error writing Value: ", error);
                });
        }
    })
}

export const validateAddAppointment = (payload) => {
    return new Promise(async (resolve) => {
        const { children_id, class_id, location_id, teacher_id, date, day  } = payload;
        await db.collection("booking")
            // .where('children_id', '==', children_id)
            // .where('class_id', '==', class_id)
            // .where('date', '==', date)
            .where('class_id', '==', class_id)
            .where('location_id', '==', location_id)
            .where('teacher_id', '==', teacher_id)
            .where('start_time', '==', date)
            .where('day', '==', day)
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

const sendAppointmentNotification = (DocId, noti_token, isEdit) => {
    return new Promise(async (resolve) => {
        axios
            .post(
                "https://fcm.googleapis.com/fcm/send",
                {
                    "notification": {
                        "title": "Appointment",
                        "body": isEdit ? "Your Appointment edit successfully" : "Your appointment is set"
                    },
                    "data": {
                        "type": "addAppointment"
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

export const getTotalSizeofAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("booking")
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

export const getLocationData = (locationId) => {
    return new Promise(async (resolve) => {
        await db.collection("location")
            .doc(locationId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getTeacherData = (teacherId) => {
    return new Promise(async (resolve) => {
        await db.collection("teacher")
            .doc(teacherId)
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

export const getParentById = (parentId) => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .doc(parentId)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

export const getAllAppointmentData = async () => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();

        db.collection("booking")
            .orderBy('booking_id', 'desc')
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
                        const { parent_id } = childData;
                        const parentData = await getParentById(parent_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        const childDataObj = {
                            childName: childData.fname + ' ' + childData.lname,
                            childAge: childData.age,
                            parent_id: childData.parent_id
                        }

                        const parentObj = {
                            parent_name: parentData.firstName + ' ' + parentData.lastName
                        }

                        arr.push({ id: doc.id, ...classData[0], ...locationData[0], ...childDataObj, ...teacherDataObj, ...parentObj, ...data });

                        if (index === querySnapshot.docs.length - 1) {
                            resolve(arr);
                        }
                    });
                }
            })
    })
}

export const getNextAppointmentData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        const classList = await getClassList();
        const locationList = await getLocationList();
        const staffList = await getStaffList();
        await db.collection("booking")
            .orderBy('booking_id', 'asc')
            .startAfter(lastVisible.booking_id)
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
                        const { parent_id } = childData;
                        const parentData = await getParentById(parent_id);

                        const teacherDataObj = {
                            teacherName: teacherData.length <= 0 ? null : teacherData[0].fname + ' ' + teacherData[0].lname,
                            teacherEmail: teacherData.length <= 0 ? null : teacherData[0].email
                        }

                        const childDataObj = {
                            childName: childData.fname + ' ' + childData.lname,
                            childAge: childData.age,
                            parent_id: childData.parent_id
                        }

                        const parentObj = {
                            parent_name: parentData.firstName + ' ' + parentData.lastName
                        }


                        arr.push({ id: doc.id, ...classData[0], ...locationData[0], ...childDataObj, ...teacherDataObj, ...parentObj, ...data });
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
                        ...parentData
                        // email: email,
                        // parent_id: parent_id
                    }
                    response.push(responseData)
                });

                resolve(response);
            })
    })
}

export const getParentData = (parentEmail) => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .where('email', '==', parentEmail)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                const arr = [];

                querySnapshot.docs.map((doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                resolve(arr[0]);
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

export const editAppointmentFB = async (appointmentId, noti_token, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("booking")
            .doc(appointmentId)
            .update(data)
            .then(function (docRef) {
                sendAppointmentNotification(appointmentId, noti_token, true)
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const filterViewBookingData = (dataPayload, date) => {
    return new Promise(async (resolve) => {
        const {
            class_id,
            location_id,
            teacher_id,
            start_time,
            day
        } = dataPayload

        const validateStartTime = moment(start_time, 'HH:mm').format("hh:mm a");
        console.log(validateStartTime)
        await db.collection("booking")
            .where('class_id', '==', class_id)
            .where('location_id', '==', location_id)
            .where('teacher_id', '==', teacher_id)
            .where('start_time', '==', validateStartTime)
            .where('day', '==', day)
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

export const getStaffList = () => {
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

export const getTimeSlotByPayload = (dataPayload, date) => {
    return new Promise(async (resolve) => {
        const {
            class_id,
            location_id,
            teacher_id,
            timeSlot,
        } = dataPayload

        await db.collection("class_timeslot")
            .where('class_id', '==', class_id)
            .where('location_id', '==', location_id)
            .where('teacher_id', '==', teacher_id)
            .where('day', '==', timeSlot)
            .get()
            .then((querySnapshot) => {
                const arr = [];

                querySnapshot.docs.map((doc) => {
                    arr.push({ start_time: doc.data().start_time })
                });
                resolve(arr);
            })
    })
}