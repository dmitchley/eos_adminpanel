import { myFirebase, db } from 'services/firebase';
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

export const getStaffList = () => {
    return new Promise(async (resolve, reject) => {
        db.collection("teacher")
            .get()
            .then(async (querySnapshot) => {
                const arr = [];
                querySnapshot.docs.map(async (doc) => {
                    arr.push({ id: doc.id, ...doc.data() })
                });
                const sortArray = _.orderBy(arr, ['lname'],['asc']);
                resolve(sortArray);
            })
    })
}

export const deleteTeacherFB = async (teacherId) => {
    try {
        return new Promise(async (resolve, reject) => {
            db.collection('teacher')
                .doc(teacherId)
                .delete()
                .then(() => {
                    resolve(teacherId)
                });
        })
    } catch (error) {
        return null
    }
}

export const getTotalSizeofStaffList = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("teacher")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const importStaffListFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        const batch = db.batch();

        data.forEach((item, index) => {
            // const generatedDocId = await firestoreAutoId();
            const email = item[`Email`];
            const fname = item[`First Name`];
            const lname = item[`Last Name`];

            const staffDataObj = {
                // teacher_id: generatedDocId,
                email,
                fname,
                lname
            }

            const docRef = db.collection('teacher').doc();
            arr.push({ ...staffDataObj, teacher_id: docRef.id })
            batch.set(docRef, { ...staffDataObj, teacher_id: docRef.id });

            // db.collection("teacher")
            //     .doc(generatedDocId)
            //     .set(staffDataObj)
            //     .then(function (docRef) {
            //         arr.push(staffDataObj)
            //         if (index == (data.length - 1)) {
            //             resolve(arr)
            //             // resolve(true)
            //         }
            //     })
            //     .catch(function (error) {
            //         console.error("Error writing Value: ", error);
            //     });

        })

        await batch.commit().then(() => {
            resolve(arr)
        })
    })
}