import * as firebase from 'firebase';

require('@firebase/firestore');
// Your web app's Firebase configuration

var firebaseConfig = {
  apiKey: "AIzaSyCE8NoeFMY-NtTNUl0it52Ee-QFvDhgQA0",
  authDomain: "bazar-messenger.firebaseapp.com",
  databaseURL: "https://bazar-messenger-default-rtdb.firebaseio.com",
  projectId: "bazar-messenger",
  storageBucket: "bazar-messenger.appspot.com",
  messagingSenderId: "738202478996",
  appId: "1:738202478996:web:6ed71a3a9f4de079348781"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();