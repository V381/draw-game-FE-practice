import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// This should be not private I... https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: 'AIzaSyBMo3yESMc9QDyGznUEXPJaJJShiqwaww4',
  authDomain: 'draw-game-3d824.firebaseapp.com',
  projectId: 'draw-game-3d824',
  storageBucket: 'draw-game-3d824.appspot.com',
  messagingSenderId: '1092188686536',
  appId: '1:1092188686536:web:883b7e4a51fbf07afefdfd',
  measurementId: 'G-HK56LWG2T7'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth, createUserWithEmailAndPassword }
