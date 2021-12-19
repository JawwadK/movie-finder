import firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuGZ4mRNbO0CxhddrgZ_44kR9L_AEyEBM",
  authDomain: "cps842-movie-ratings.firebaseapp.com",
  projectId: "cps842-movie-ratings",
  storageBucket: "cps842-movie-ratings.appspot.com",
  messagingSenderId: "136409500057",
  appId: "1:136409500057:web:d4a8537a74f4867ae86b08"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };