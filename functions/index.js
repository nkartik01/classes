const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase");
const admin = require("firebase-admin");
const cors = require("cors");
var serviceAccount = require("./vikas-school-firebase-adminsdk-5y0pj-eef7379e12.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vikas-school.firebaseio.com",
});
var app = express();
const firebaseConfig = {
  apiKey: "AIzaSyC_3B9EBT-cce1UioOvJoH0dMvHaruvxvg",
  authDomain: "vikas-school.firebaseapp.com",
  databaseURL: "https://vikas-school.firebaseio.com",
  projectId: "vikas-school",
  storageBucket: "vikas-school.appspot.com",
  messagingSenderId: "507579879626",
  appId: "1:507579879626:web:44d190c879cfaf3521a433",
  measurementId: "G-FVGT74S4BQ",
};
app.use(cors());
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// app.use(express.json({ extended: false }));
app.use("/", require("./api"));
exports.api = functions.https.onRequest(app);
