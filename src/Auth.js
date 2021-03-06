import React, { useEffect, useState } from 'react';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import firebase from 'firebase';
import App from './App';
import Nav from './Nav';
import './Auth.css'
import './firebaseui-styling.global.css'
import { updateDataBase, clearLocalStorage } from './helper'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/#/auth',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
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
      return <div className="auth-container">
        <Nav />
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
  }

  // move local storage to database once user signs in
  if(window.localStorage.places) {
    const data = JSON.parse(window.localStorage.getItem('places'));
    const localPlaces = [];
    data.forEach(place => {
      const placeObj = {};
      placeObj.lat = place.lat;
      placeObj.lng = place.lng;
      placeObj.name = place.name;
      placeObj.years = place.years;
      localPlaces.push(placeObj);
    })

    // localPlaces.forEach(place => updateDataBase(place));
    updateDataBase(localPlaces);
    clearLocalStorage()
  }

  return <App isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />;
};

export default Auth;


