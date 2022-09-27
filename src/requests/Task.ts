import { useAuthContext } from "../customHooks/useAuthContext";
import { push, child, ref, getDatabase, update } from "firebase/database";
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../FirebaseConfig.js';

type Updates = {
  [key: string]: object
  // de creat type pentru taks si users si assignat aici in loc de obj
}

const Firebase = firebase.initializeApp(firebaseConfig);

const database = getDatabase(Firebase);


export function WRITENEWTASK(taskTitle: string, taskDescription: string, selectedDate: Date, personAssigned: string) {
  const { guid: uid }: any = useAuthContext();

  // A task entry.
  const myDate = new Date();
  const userData = {
    uid,
    taskTitle,
    taskDescription,
    selectedDate,
    userGuid: uid,
    personsAssigned: personAssigned,
    timestamp: myDate,
    isDone: false,
  }

  // Get a key for a new task.
  const newTaskId = push(child(ref(database), 'tasks')).key;

  const updates: Updates = {};
  updates[`/tasks/' + ${newTaskId}`] = userData;

  return update(ref(database), updates).then(() => {
  }).catch((err: any) => {
    console.log(err)
  })
};