import { myFirebase, db } from 'services/firebase';
import _ from 'lodash';
import { getStaffList, getLocationList } from 'actionStore/FirebaseAction/appointmentAction';

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
                const sortArray = _.orderBy(arr, ['class_name'],['asc']);
                resolve(sortArray);
            })
    })
}

export const getTotalSizeofClassList = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("classes")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const importClassListFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();

        data.forEach((item, index) => {
            // const generatedDocId = await firestoreAutoId();
            // const category_name = item[`CategoryName`];
            const class_name = item[`Standard`];
            const teacher_name = item[`Teacher`];
            const location_name = item[`Venue`];

            const student_limit = item[`Student Limit`];
            const startTime = item[`Start Time`];
            const duration = item[`Duration`];
            const days = item[`Days`];


            const classDataObj = {
                // class_id: generatedDocId,
                // category_name,
                class_name,
                student_limit,
                startTime,
                duration,
                days
            }

            // const docRef = db.collection('classes').doc();
            // arr.push({ ...classDataObj, class_id: docRef.id })
            // batch.set(docRef, { ...classDataObj, class_id: docRef.id });

            // const classListRef = db.collection("classes");
            // const query = classListRef.where("class_name", "==", class_name).limit(1);
            // query.get().then((snapshot) => {
            //     if (!snapshot.empty) {
            //         if (index == (data.length - 1)) {
            //             resolve(true)
            //         }
            //         return;
            //     } else {
            //         db.collection("classes")
            //             .doc(generatedDocId)
            //             .set(classDataObj)
            //             .then(function (docRef) {
            //                 arr.push(classDataObj)
            //                 if (index == (data.length - 1)) {
            //                     resolve(arr)
            //                     // resolve(true)
            //                 }
            //             })
            //             .catch(function (error) {
            //                 console.error("Error writing Value: ", error);
            //             });
            //     }
            // });

        })

        // await batch.commit().then(() => {
        //     resolve(arr)
        //     // resolve(true)
        // })
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