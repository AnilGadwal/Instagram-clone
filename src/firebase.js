// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  import firebase from "firebase";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD7HZk0Y6YojMF8D-htpB8YKZQviH6bZfg",
    authDomain: "instagram-clone-7dca2.firebaseapp.com",
    databaseURL: "https://instagram-clone-7dca2.firebaseio.com",
    projectId: "instagram-clone-7dca2",
    storageBucket: "instagram-clone-7dca2.appspot.com",
    messagingSenderId: "1006053571929",
    appId: "1:1006053571929:web:935b463dcd63e33737e048",
    measurementId: "G-6P1R91740D"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage};