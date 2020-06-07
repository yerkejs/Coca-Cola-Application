import {firestore, admin} from './firebase'


export const loadPersonalData = (uid) =>
  firestore.collection("users").doc(uid).get()
export const setLocation = (uid, location, city) =>
  firestore.collection("users").doc(uid).set({
    l: location, point: 0, data: [], city
  })
export const addCoins = (uid, date) =>
  firestore.collection("users").doc(uid).update({
    point: admin.firestore.FieldValue.increment(1),
    data: admin.firestore.FieldValue.arrayUnion({day: date})
  })

export const addCode = (code) =>
  firestore.collection("codes").doc("code").update({
    codes: admin.firestore.FieldValue.arrayUnion(code)
  })

export const getCode = () =>
  firestore.collection("codes").doc("code").get()


export const setPrise = (uid) =>
  firestore.collection("users").doc(uid).set({
    prise: true
  }, {merge: true})




export const getRank = () =>
  firestore.collection("users").orderBy("point", "desc").get()
