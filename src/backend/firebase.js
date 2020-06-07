import * as firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';


const config = {
 // YOUR CONFIG FILES HERE
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
firebase.auth().settings.appVerificationDisabled = true
console.log(firebase.auth())
const auth = firebase.auth();
const firestore = firebase.firestore();
const admin = firebase
export {
  auth,
  firestore,
  admin
};
