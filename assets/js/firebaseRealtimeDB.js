var updateDB = null;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBWL1Vw_xX_H_HWNYhFKWyaY17LLvRNY2I",
  authDomain: "ld43-gamejam.firebaseapp.com",
  databaseURL: "https://ld43-gamejam.firebaseio.com",
  projectId: "ld43-gamejam",
  storageBucket: "ld43-gamejam.appspot.com",
  messagingSenderId: "199950348470"
};
firebase.initializeApp(config);
var defaultDatabase = firebase.database();

var ref = defaultDatabase.ref();
ref.on('value', function (snapshot) {
  var database = document.forms['form'].database;
  var val = JSON.stringify(snapshot.val());
  database.value = val;
});
updateDB = function () {
  try {
    var val = document.forms['form'].database.value;
    ref.update(JSON.parse(val));
  } catch (e) {
    alert(e.message);
  }
}