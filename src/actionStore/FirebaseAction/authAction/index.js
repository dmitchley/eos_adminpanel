import { myFirebase, db } from 'services/firebase';


export const getAdminCredential = async () => {
    return new Promise(async (resolve, reject) => {
        const response = db.collection('admin');
        const data = await response.get();
        data.docs.forEach(item => {
            resolve({...item.data(), id: item.id})
        })
    })
}