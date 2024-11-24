// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBE9Yzd7sNEn0CEvLycRAkVyybs4RqSzdY",

  authDomain: "blog-8e738.firebaseapp.com",

  projectId: "blog-8e738",

  storageBucket: "blog-8e738.firebasestorage.app",

  messagingSenderId: "656573159207",

  appId: "1:656573159207:web:8b19400252d7da05dffb02",

  measurementId: "G-WRZ40JDC7Q"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {app, auth};