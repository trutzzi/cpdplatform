import './App.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { blue, green } from '@mui/material/colors';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, push, child, update, equalTo, orderByChild, query } from "firebase/database";
import 'firebase/compat/auth';
import UserComponent from './components/UserComponent';
import NewTaskDrawerComponent from './components/NewTaskDrawer';
import { firebaseConfig } from './FirebaseConfig';
import TaskComponents from './components/TaskComponent';
import useTitler from './customHooks/useTitler';
import Navigation from './components/Navigation';
import { AuthProvider, UserContextType } from './contexts/UserContext';

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
    supervisorId: '',
    admin: true,
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
  const [taskAssignedResults, setTaskAssigendRestults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const db = getDatabase();

  const [docTitle, setDocTitle] = useTitler('CPD Platform');

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  function writeNewTask(taskTitle: string, taskDescription: string, selectedDate: Date, personAssigned: string) {

    // A task entry.
    const myDate = new Date();
    const userData = {
      uid: user?.guid,
      taskTitle,
      taskDescription,
      selectedDate,
      userGuid: user?.guid,
      personsAssigned: personAssigned,
      timestamp: myDate,
      isDone: false,
    };

    // Get a key for a new task.
    const newTaskId = push(child(ref(database), 'tasks')).key;

    const updates: any = {};
    updates[`/tasks/' + ${newTaskId}`] = userData;

    return update(ref(database), updates).then(() => {
      console.log("New task has been created")
    }).catch(err => {
      console.log(err)
    })
  }


  const updateDoneTask = (taskId: string, statusToggle: Boolean) => {
    update(ref(db, `tasks/${taskId}`), {
      isDone: statusToggle
    });
  }

  const isAllreadyUser = async (uid: string) => {
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

  function getUserByUid() {
    const getUserByUid = ref(database, `users/${user.guid}`);
    onValue(getUserByUid, (snapshot) => {
      const data = snapshot.val();
      setTaskResults(data);
    });
    return database;
  }

  useEffect(() => {
    if (user?.guid?.length) {
      const getTasks = ref(database, `tasks/`);
      const getEmployes = query(ref(db, 'users'), orderByChild('supervisorId'), equalTo(user?.guid));
      const getUserByUid = ref(database, `users/${user.guid}`);

      // TODO: LEARN TO MAKE REQUEST SEPARATED
      const getTaskAssigned = query(ref(db, 'tasks'), orderByChild('personsAssigned'), equalTo(user?.guid));
      onValue(getTaskAssigned, (snapshot) => {
        const data = snapshot.val();
        setTaskAssigendRestults(data);
      });

      // Get task request
      onValue(getTasks, (snapshot) => {
        const data = snapshot.val();
        setTaskResults(data);
      });

      // Get users request
      onValue(getEmployes, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
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
        writeNewUser(userDB?.uid!, userDB?.displayName!, userDB?.email!, userDB?.photoURL!);
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
      </div>
    );
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <AuthProvider.Provider value={{ name: user?.name, guid: user?.guid, avatar: user?.avatar, admin: user?.admin }}>
          <Router>
            <Navigation onNewTaskHandler={() => setIsDrawerOpen(true)} onSignOut={signOut} />

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <Routes >
              <Route path="/">
              </Route>
              <Route path="/users" element={<UserComponent onResults={usersResults} />}>
              </Route>
              <Route path="/tasks" element={<TaskComponents onDone={updateDoneTask} onResults={taskResults} />} >
              </Route>
              <Route path="/mytask" element={<TaskComponents onDone={updateDoneTask} onResults={taskAssignedResults} />} >
              </Route>
            </Routes >
          </Router>
          {user?.admin && <NewTaskDrawerComponent onUsersSearch={usersResults} onToggleDrawer={toggleDrawer} onOpen={isDrawerOpen} onWriteNewTask={writeNewTask} />}
        </AuthProvider.Provider>
      </ThemeProvider>
    </div >
  );
}

export default App;
