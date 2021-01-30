import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCBeyorNQGohfp1oEM-6e-hls_1Rkt_UqY",
  authDomain: "gelcipes.firebaseapp.com",
  projectId: "gelcipes",
  storageBucket: "gelcipes.appspot.com",
  messagingSenderId: "121386020495",
  appId: "1:121386020495:web:58ecb06cfe23838b820afa"
};

// init firebase
firebase.initializeApp(firebaseConfig)

const fbaseAuth = firebase.auth()
const gProvider = new firebase.auth.GoogleAuthProvider()
const fbaseFirestoreUnion = firebase.firestore.FieldValue.arrayUnion
const fbaseFirestore = firebase.firestore()
const fbaseStorage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { fbaseAuth, gProvider, fbaseFirestore, fbaseStorage, fbaseFirestoreUnion, timestamp }