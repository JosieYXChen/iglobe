import React, { useEffect, useState } from 'react';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import firebase from 'firebase';
import App from './App';
// import functions from 'functions'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/app',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

const Auth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, []);

  if (!isSignedIn) {
      return <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
  }
  return <App isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />;
};

export default Auth;
