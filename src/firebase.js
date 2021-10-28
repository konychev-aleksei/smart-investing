import firebase from 'firebase'

firebase.initializeApp({
  apiKey: "AIzaSyDb7wcrrhqbsX2tzPsNy0FJAquc-rwyX1o",
  authDomain: "new-project-95ff8.firebaseapp.com",
  databaseURL: "https://new-project-95ff8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "new-project-95ff8",
  storageBucket: "new-project-95ff8.appspot.com",
  messagingSenderId: "161453550906",
  appId: "1:161453550906:web:056e35749571ddfdc97403",
  measurementId: "G-0BXSC98KJY"
})

const auth = firebase.auth()

export { auth }
