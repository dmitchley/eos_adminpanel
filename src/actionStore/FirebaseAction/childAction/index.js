import { myFirebase, db } from 'services/firebase';

const onePageCount = 20;

export const addChildFB = (data) => {
    return new Promise(async (resolve, reject) => {
        const generatedDocId = await firestoreAutoId();
        db.collection("children")
            .doc(generatedDocId)
            .set({ children_id: generatedDocId, ...data })
            .then(function (docRef) {
                resolve({ ...data });
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const editChildFB = async (childId, data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("children")
            .doc(childId)
            .update(data)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const deleteChildFB = async (childId) => {
    try {
        return new Promise(async (resolve, reject) => {
            db.collection('children')
                .doc(childId)
                .delete()
                .then(() => {
                    resolve(childId)
                });
        })
    } catch (error) {
        return null
    }
}

export const getTotalSizeofChildren = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("children")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const getAllChildrenData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("children")
            .orderBy('lname', 'asc')
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];
                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const parentData = await getParentData(data.parent_id);
                        const { firstName, lastName } = parentData;

                        arr.push({ id: doc.id, parentName: firstName + ' ' + lastName, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
            })
            .catch(function (error) {
                resolve([]);
                console.error("Error writing Value: ", error);
            });
    })
}

export const getNextChildrenData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        await db.collection("children")
            .orderBy('lname', 'asc')
            .startAfter(lastVisible.lname)
            .limit(onePageCount)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map(async (doc, index) => {
                        const data = doc.data();
                        const parentData = await getParentData(data.parent_id);
                        const { firstName, lastName } = parentData;
                        arr.push({ id: doc.id, parentName: firstName + lastName, ...data });

                        if (index == (querySnapshot.docs.length - 1)) {
                            resolve(arr);
                        }
                    });
                }
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

const getParentData = (parent_id) => {
    return new Promise(async (resolve) => {
        await db.collection("parents")
            .doc(parent_id)
            .get()
            .then((doc) => {
                resolve(doc.data());
            })
    })
}

const getParentId = (parentEmail) => {
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

export const getExistedChildData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("children")
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];
                    querySnapshot.docs.map((doc) =>
                        arr.push({ id: doc.id, ...doc.data() })
                    );
                    resolve(arr);
                }
            })
    })
}

const createBatchforChild = (data, batch) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];
        await data.forEach(async (item, index) => {
            // const generatedDocId = await firestoreAutoId();

            const age = item[`Age`];
            const dob = item[`DOB`];
            const fname = item[`First Name`];
            const lname = item[`Last Name`];
            const gender = item[`Gender`];
            const is_active = item[`Active`];
            const last_garded = item[`Last Graded`];
            const level = item[`Level`];
            const medical = item[`Medical Conditions`];
            const notes = item[`Notes`];
            const reference_by = item[`Referral Source`];
            const school = item[`School`];
            const standard_id = item[`Standard`];
            const start_date = item[`Start Date`];
            const parentEmail = item[`Customer Email`];

            const parentData = await getParentId(parentEmail);
            const { parent_id } = parentData;

            const childObj = {
                // children_id: generatedDocId,
                age,
                dob,
                fname,
                lname,
                gender,
                is_active,
                last_garded,
                level,
                medical,
                notes,
                reference_by,
                school,
                standard_id,
                start_date,
                parent_id: parent_id
            }

            const docRef = db.collection('children').doc();
            arr.push({ ...childObj, children_id: docRef.id })
            batch.set(docRef, { ...childObj, children_id: docRef.id });

            if (index == (data.length - 1)) {
                resolve({
                    newChild: arr,
                    newBatch: batch
                })
            }
        })
    })
}

export const importChildFB = async (data) => {
    return new Promise(async (resolve, reject) => {

        if (data.length < 500) {
            let batch = db.batch();

            const childBatch = await createBatchforChild(data, batch);
            const { newChild, newBatch } = childBatch;

            batch = newBatch;
            await batch.commit().then(() => {
                resolve(newChild)
            })
        }
        else {
            var perChunk = 500 // items per chunk    
            var result = data.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / perChunk)
                if (!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                }
                resultArray[chunkIndex].push(item)
                return resultArray
            }, [])
            console.log(result);

            result.forEach(async (data1, index) => {

                let batch = db.batch();

                const childBatch = await createBatchforChild(data1, batch);
                const { newChild, newBatch } = childBatch;

                batch = newBatch;
                batch.commit().then(() => {
                    resolve(newChild)
                })

            })// EOF result for each

        }
    })
}