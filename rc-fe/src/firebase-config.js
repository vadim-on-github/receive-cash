import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ1_86DEuf6b6NrXF7u9Np_xdjSlb-kag",
  authDomain: "receive-cash-vh.firebaseapp.com",
  databaseURL: "https://receive-cash-vh-default-rtdb.firebaseio.com",
  projectId: "receive-cash-vh",
  storageBucket: "receive-cash-vh.appspot.com",
  messagingSenderId: "85798170690",
  appId: "1:85798170690:web:d97678f99c589b7f837ddb"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
