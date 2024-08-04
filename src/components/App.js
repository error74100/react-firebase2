import React, { useState } from 'react';
import '../App.css';
import AppRouter from './AppRouter';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;

      setIsLoggedIn(true);
      setUserObj(user);
    } else {
      // User is signed out
      setIsLoggedIn(false);
    }

    setInit(true);
  });

  return (
    <div className="App">{init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : '회원정보 확인중..'}</div>
  );
}

export default App;
