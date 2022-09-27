import './App.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green } from '@mui/material/colors';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, push, child, update, equalTo, orderByChild, query, get } from "firebase/database";
import 'firebase/compat/auth';
import UserComponent from './components/UserComponent';
import NewTaskDrawerComponent from './components/NewTaskDrawer';
import { firebaseConfig } from './FirebaseConfig';
import TaskComponents from './components/TaskComponent';
import Navigation from './components/Navigation';
import { AuthProvider, UserContextType } from './contexts/UserContext';
import { CssBaseline, Container } from '@mui/material';

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


type Updates = {
  [key: string]: object
  // de creat type pentru taks si users si assignat aici in loc de obj
}

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
  const updates: Updates = {};
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
    avatar: null,
    email: null
  });

  const [usersResults, setUsersResults] = useState([]);
  const [taskResults, setTaskResults] = useState([]);
  const [taskAssignedResults, setTaskAssigendRestults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const db = getDatabase();

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  function writeNewTask(taskTitle: string, taskDescription: string, selectedDate: Date, personAssigned: string) {

    // A task entry.
    const myDate = new Date();
    const newTask = {
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

    const updates: Updates = {};
    updates[`/tasks/' + ${newTaskId}`] = newTask;

    return update(ref(database), updates).then(() => {
    }).catch(err => {
      console.log(err)
    })
  }


  const updateDoneTask = (taskId: string, statusToggle: Boolean) => {
    update(ref(db, `tasks/${taskId}`), {
      isDone: statusToggle
    });
  }

  const getUser = async (uid: string) => {
    const dbRef = ref(getDatabase());
    const resp = await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
      return snapshot.val()
    }).catch((error) => {
      console.error(error);
    });
    return resp;
  }

  useEffect(() => {
    /**
     * If user exist
     */
    if (user?.guid?.length) {
      const getTasks = ref(database, `tasks/`);
      const getEmployes = query(ref(db, 'users'), orderByChild('supervisorId'), equalTo(user?.guid));
      const getUserByUid = ref(database, `users/${user.guid}`);
      const test = query(ref(db, 'users/'), orderByChild('supervisorId'), equalTo(user?.guid),);

      // de facut functii externe pentru requesturi cu params
      const getTaskAssigned = query(ref(db, 'tasks'), orderByChild('personsAssigned'), equalTo(user?.guid));
      onValue(getTaskAssigned, (snapshot) => {
        const data = snapshot.val();
        setTaskAssigendRestults(data);
      });

      // Get task request
      onValue(getTasks, async (snapshot) => {
        const data = snapshot.val();
        // const tasks = await Promise.all(data.map((item: any) => {

        //   return { ...item, user }
        // }))

        setTaskResults(data);
      });

      // Get users request
      onValue(getEmployes, (snapshot) => {
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

        // Create user if not exist in local db
        const userExist = await getUser(userDB?.uid);
        if (!(!!userExist)) {
          writeNewUser(userDB?.uid!, userDB?.displayName!, userDB?.email!, userDB?.photoURL!);
        }

        setUser({ name: userDB.displayName, guid: userDB.uid, avatar: userDB.photoURL, admin: null, email: userDB.email });
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
        <CssBaseline />
        <AuthProvider.Provider value={user}>
          <Router>
            <Navigation onNewTaskHandler={() => setIsDrawerOpen(true)} onSignOut={signOut} />
            <Container>
              <Routes >
                <Route path="/" element={user?.admin ? <Navigate to="/users" /> : <Navigate to="/mytask" />}>
                </Route>
                <Route path="/users" element={<UserComponent onResults={usersResults} />}>
                </Route>
                <Route path="/tasks" element={user?.admin ? <TaskComponents onDone={updateDoneTask} onResults={taskResults} /> : <Navigate to="/" />}>
                </Route>
                <Route path="/mytask" element={!user?.admin ? <TaskComponents onDone={updateDoneTask} onResults={taskAssignedResults} /> : <Navigate to="/" />} >
                </Route>
              </Routes >
            </Container>
          </Router>
          {user?.admin && <NewTaskDrawerComponent onUsersSearch={usersResults} onToggleDrawer={toggleDrawer} onOpen={isDrawerOpen} onWriteNewTask={writeNewTask} />}
        </AuthProvider.Provider>
      </ThemeProvider>
    </div >
  );
}

export default App;
