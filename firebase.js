// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("portfolio-pro-3c915-firebase-adminsdk-fbsvc-21e7210940");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "portfolio-pro-3c915.firebase.io.com"
});

const db = admin.firestore();
module.exports = db;
