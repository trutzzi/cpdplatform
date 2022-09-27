import { getDatabase, ref, child, get, update, push, onValue } from "firebase/database";
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../FirebaseConfig.js';
const Firebase = firebase.initializeApp(firebaseConfig);

const database = getDatabase(Firebase);

type UserData = {
  guid: string;
  name: string;
  email: string;
  timestamp: Date;
  photoURL: string;
  supervisorId: string;
  admin: boolean;
};

type UpdatedUser = {
  [key: string]: UserData
  // de creat type pentru taks si users si assignat aici in loc de obj
};


export const WRITENEWUSER = (uid: string, name: string, email: string, photoURL: string) => {

  // Get a key for a new user.
  const newUserKey = push(child(ref(database), 'users')).key;

  // Write the new user's data simultaneously in the users list and the user's user list.
  const myDate = new Date();
  const userData = {
    guid: uid,
    name,
    email,
    timestamp: myDate,
    photoURL: photoURL,
    supervisorId: '',
    admin: true,
  }


  const updates: UpdatedUser = {};
  updates['/users/' + uid] = userData;

  return update(ref(database), updates).then(() => {
    console.log("New users has been created")
  })
};

export const GETUSER = async (uid: string) => {
  const dbRef = ref(getDatabase());
  const resp = await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    return snapshot.val()
  }).catch((error: any) => {
    console.error(error);
    return false;
  });
  return resp;
}

export const ISALLREADYUSER = async (uid: string) => {
  const getUserByUid = ref(database, `users/${uid}`);

  let userExist = false;
  await onValue(getUserByUid, (snapshot) => {
    userExist = snapshot.exists();
    console.log('*', userExist)
  })

  // TODO: MAKE SOMEHOW TO CHECK IF USER ALLREADY EXIST
  console.log('**', userExist)
  return userExist;
}