import firebase from "../config/firebase";

const db = firebase.database();

export const setCodeUptream = (code, cb) => {
  const newKey = db.ref().child('code').push().key;

  db.ref().child(`code/${newKey}`).set({
    code,
  })
  .then(data => {
    cb(newKey);
    alert(`localhost:3000/${newKey}`);
  })
  .catch(err => {
    console.log(err);
  });
};

export const getCodeUpstream = (id, cb) => {
  db.ref(`code/${id}`).on('value', snapshot => {
    const data = snapshot.val();
    console.log('data', data)
    cb(data.code);
  });
};
