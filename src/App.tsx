import './App.css';
// Import FirebaseAuth and firebase.
import React, { useEffect, useState, createContext } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green } from '@mui/material/colors';
import NewTaskDrawerComponent from './components/NewTaskDrawer';
import UserComponent from './components/UserComponent';
import TaskComponents from './components/TaskComponent';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, push, child, set, update } from "firebase/database";
import 'firebase/compat/auth';
import { firebaseConfig } from './FirebaseConfig';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UserProvider from './UserProvider';
import SnackBarComponent from './components/Snackbar';
import useTitler from './customHooks/useTitler';
import Navigation from './components/Navigation';


type UserContextType = {
  name: string | null | undefined;
  guid: string | null | undefined;
  avatar: string | null | undefined;
  admin: boolean | null | undefined;
};

const INITIALUSER = {
  name: null,
  guid: null,
  avatar: null,
  admin: null
};


const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: blue[500]
    },
  },
});


const Firebase = firebase.initializeApp(firebaseConfig);
export const AuthProvider = createContext<UserContextType>(INITIALUSER);

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in. 
    signInSuccessWithAuthResult: () => false,
  },
};

const database = getDatabase(Firebase);


function writeNewUser(uid: string, name: string, email: string, photoURL: string) {
  const myDate = new Date();
  const userData = {
    uid,
    name,
    email,
    timestamp: myDate,
    photoURL: photoURL,
    admin: false,
  };

  // Get a key for a new user.
  const newUserKey = push(child(ref(database), 'users')).key;

  // Write the new user's data simultaneously in the users list and the user's user list.
  const updates: any = {};
  updates['/users/' + uid] = userData;

  return update(ref(database), updates).then(() => {
    console.log("New users has been created")
  })
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  const [user, setUser] = useState<UserContextType>({
    name: null,
    guid: null,
    admin: null,
    avatar: null
  });

  const [usersResults, setUsersResults] = useState([]);
  const [taskResults, setTaskResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const [docTitle, setDocTitle] = useTitler('CPD Platform');

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  function writeNewTask(taskTitle: string, taskDescription: string, selectedDate: any) {

    // A task entry.
    const myDate = new Date();
    const userData = {
      uid: user?.guid,
      taskTitle,
      taskDescription,
      selectedDate,
      userGuid: user?.guid,
      timestamp: myDate,
      isDone: false,
    };

    // Get a key for a new task.
    const newTaskId = push(child(ref(database), 'tasks')).key;

    // Write the new user's data simultaneously in the users list and the user's user list.
    const updates: any = {};
    updates[`/tasks/${user?.guid}/' + ${newTaskId}`] = userData;

    return update(ref(database), updates).then(() => {
      console.log("New task has been created")
    }).catch(err => {
      console.log(err)
    })
  }


  const updateDoneTask = (taskId: string, statusToggle: Boolean) => {
    const db = getDatabase();
    update(ref(db, `tasks/${user.guid}/${taskId}`), {
      isDone: statusToggle
    });
  }

  const isAllreadyUser = async (uid: string) => {
    const getUserByUid = ref(database, `users/${uid}`);
    const userExist = await onValue(getUserByUid, (snapshot) => {
      // console.log(snapshot.exists())
      return snapshot.exists();
    })

    // TODO: MAKE SOMEHOW TO CHECK IF USER ALLREADY EXIST
    // console.log(userExist);
    return userExist;
  }

  useEffect(() => {
    if (user?.guid?.length) {
      const getTasks = ref(database, `tasks/${user.guid}`);
      const getUsers = ref(database, 'users');
      const getUserByUid = ref(database, `users/${user.guid}`);

      // Get task request
      onValue(getTasks, (snapshot) => {
        const data = snapshot.val();
        setTaskResults(data);
      });

      // Get users request
      onValue(getUsers, (snapshot) => {
        const data = snapshot.val();
        setUsersResults(data);
      });

      // Get user details
      onValue(getUserByUid, (snapshot) => {
        const data = snapshot.val();
        setUser({ ...user, admin: (Boolean(data?.admin)) })
      });
    }
  }, [user?.guid])



  const signOut = () => firebase.auth().signOut();

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (userDB) => {
      if (!!userDB) {
        setIsSignedIn(!!userDB);
        setUser({ name: userDB.displayName, guid: userDB.uid, avatar: userDB.photoURL, admin: null });
        if (await isAllreadyUser(userDB?.uid)) {
          console.log("user allready exist")
        } else {
          writeNewUser(userDB?.uid!, userDB?.displayName!, userDB?.email!, userDB?.photoURL!);
        }
        // writeNewUser(userDB?.uid!, userDB?.displayName!, userDB?.email!, userDB?.photoURL!);
      } else {
        setIsSignedIn(false)
      }
    });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <p style={{ textAlign: 'center' }}>Please Sign in to access the platform.</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        {!!user! && <SnackBarComponent message={'Please sign in to use the platform.!'} />}
      </div>
    );
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <AuthProvider.Provider value={{ name: user?.name, guid: user?.guid, avatar: user?.avatar, admin: user?.admin }}>
          <Router>
            <Navigation onNewTaskHandler={() => setIsDrawerOpen(true)} onSignOut={signOut} />
            <Routes >
              <Route path="/" element={<UserComponent onResults={usersResults} />}>
              </Route>
              <Route path="/users" element={<UserComponent onResults={usersResults} />}>
              </Route>
              <Route path="/tasks" element={<TaskComponents onDone={updateDoneTask} onResults={taskResults} />} >
              </Route>
            </Routes >
          </Router>
          {user?.admin && <NewTaskDrawerComponent onToggleDrawer={toggleDrawer} onOpen={isDrawerOpen} onWriteNewTask={writeNewTask} />}
        </AuthProvider.Provider>
      </ThemeProvider>
    </div >
  );
}

export default App;
