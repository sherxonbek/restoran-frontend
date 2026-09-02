

//npm install firebase
//npm install -g firebase-tools
//firebase login
//firebase init
//firebase deploy

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Siz olgan haqiqiy kalitlarni shu yerga qo'ying:
const firebaseConfig = {
    apiKey: "AIzaSyC08TbFmxCI77Egtsrt4sNgRGMV5IXNcmY",
    authDomain: "restoran-erp-e4fc3.firebaseapp.com",
    projectId: "restoran-erp-e4fc3",
    storageBucket: "restoran-erp-e4fc3.firebasestorage.app",
    messagingSenderId: "605514810671",
    appId: "1:605514810671:web:b2e20e943b6c0b4687cdda",
    measurementId: "G-3FTG2R2GZB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
