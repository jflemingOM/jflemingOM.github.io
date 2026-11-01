
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5l8IWKrVh_S5m1FGwMzbUiJTI5dB53lc",
    authDomain: "strength-training-web-dev.firebaseapp.com",
    projectId: "strength-training-web-dev",
    storageBucket: "strength-training-web-dev.firebasestorage.app",
    messagingSenderId: "94051082618",
    appId: "1:94051082618:web:57c26387db4f32131df6c3",
    measurementId: "G-W60K3RM7DV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
