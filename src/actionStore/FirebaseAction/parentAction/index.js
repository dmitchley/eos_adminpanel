import { myFirebase, db } from 'services/firebase';
import md5 from 'md5';
const onePageCount = 20;

export const addParentFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("parents")
            .add(data)
            .then(function (docRef) {
                resolve({ ...data, id: docRef.id });
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const editParentFB = async (parentId, parentPassword) => {
    return new Promise(async (resolve, reject) => {
        const md5Password = md5(parentPassword);
        db.collection("parents")
            .doc(parentId)
            .update({
                password: md5Password
            })
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const setParentPassword = async (parentId, dataStore) => {
    return new Promise(async (resolve, reject) => {
        db.collection("parents")
            .doc(parentId)
            .update(dataStore)
            .then(function (docRef) {
                resolve(true);
            })
            .catch(function (error) {
                console.error("Error writing Value: ", error);
            });
    })
}

export const getTotalSizeofParent = async (data) => {
    return new Promise(async (resolve, reject) => {
        db.collection("parents")
            .get()
            .then((querySnapshot) => {
                resolve(querySnapshot.size)
            });
    })
}

export const getAllParentsData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("parents")
            .orderBy('lastName', 'asc')
            .limit(onePageCount)
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

export const getNextParentsData = async (lastVisible) => {
    return new Promise(async (resolve, reject) => {
        await db.collection("parents")
            .orderBy('lastName', 'asc')
            .startAfter(lastVisible.lastName)
            .limit(onePageCount + 1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve([]);
                } else {
                    const arr = [];

                    querySnapshot.docs.map((doc) => {
                        arr.push({ id: doc.id, ...doc.data() })
                    });
                    resolve(arr);
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

export const getExistedParentsData = async () => {
    return new Promise(async (resolve, reject) => {
        db.collection("parents")
            .orderBy('email', 'asc')
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

export const importParentFB = async (data) => {
    return new Promise(async (resolve, reject) => {
        let arr = [];

        if(data.length<500)
        {
                        const batch = db.batch();
                        data.forEach((item, index) => {
                            // const generatedDocId = await firestoreAutoId();

                            const email = item[`Customer Email`];
                            const fname = item[`Customer First Name`];
                            const lname = item[`Customer Last Name`];
                            const parentType = item[`Customer Type(s)`];
                            const homePh = item[`Customer Home Phone`];
                            const workPh = item[`Customer Work Phone`];
                            const mobile1 = item[`Customer Mobile Phone 1`];
                            const mobile2 = item[`Customer Mobile Phone 2`];
                            const faxAddress = item[`Customer Fax`];
                            const addressLine1 = item[`Address #1`];
                            const addressLine2 = item[`Address #1`];
                            const city = item[`Suburb`];
                            const parentState = item[`State`];
                            const postalCode = item[`Postcode`];

                            const parentObj = {
                                // parent_id: generatedDocId,
                                email: email,
                                firstName: fname,
                                lastName: lname,
                                parentType: parentType,
                                homePhone: homePh,
                                workPhone: workPh,
                                primaryMobile: mobile1,
                                secondaryMobile: mobile2,
                                faxAddress: faxAddress,
                                addressLine1: addressLine1,
                                addressLine2: addressLine2,
                                city: city,
                                parentState: parentState,
                                postalCode: postalCode
                            }

                            const docRef = db.collection('parents').doc();
                            arr.push({ ...parentObj, parent_id: docRef.id })
                            batch.set(docRef, { ...parentObj, parent_id: docRef.id });

                        })

                        await batch.commit().then(() => {
                            resolve(arr)
                        })
    }
    else
    {
        console.clear();
        console.log('----- parent import -----', data.length);
        
        var perChunk = 500 // items per chunk    
        
        // var inputArray = ['a','b','c','d','e']

        var result = data.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
        }, [])

       // console.log(result);
        
        result.forEach((data1, index) => {
                        let arr = [];
                        const batch = db.batch();
                        data1.forEach((item, index) => {
                            // const generatedDocId = await firestoreAutoId();

                            const email = item[`Customer Email`];
                            const fname = item[`Customer First Name`];
                            const lname = item[`Customer Last Name`];
                            const parentType = item[`Customer Type(s)`];
                            const homePh = item[`Customer Home Phone`];
                            const workPh = item[`Customer Work Phone`];
                            const mobile1 = item[`Customer Mobile Phone 1`];
                            const mobile2 = item[`Customer Mobile Phone 2`];
                            const faxAddress = item[`Customer Fax`];
                            const addressLine1 = item[`Address #1`];
                            const addressLine2 = item[`Address #1`];
                            const city = item[`Suburb`];
                            const parentState = item[`State`];
                            const postalCode = item[`Postcode`];

                            const parentObj = {
                                // parent_id: generatedDocId,
                                email: email,
                                firstName: fname,
                                lastName: lname,
                                parentType: parentType,
                                homePhone: homePh,
                                workPhone: workPh,
                                primaryMobile: mobile1,
                                secondaryMobile: mobile2,
                                faxAddress: faxAddress,
                                addressLine1: addressLine1,
                                addressLine2: addressLine2,
                                city: city,
                                parentState: parentState,
                                postalCode: postalCode
                            }

                            const docRef = db.collection('parents').doc();
                            arr.push({ ...parentObj, parent_id: docRef.id })
                            batch.set(docRef, { ...parentObj, parent_id: docRef.id });

                        })

                         batch.commit().then(() => {
                            resolve(arr)
                        })


        }) // main for each
    }




    })
}