import firebase from "../config/firebase";

const db = firebase.database();

export const setCodeUptream = (code, cb) => {
  const newKey = db.ref().child('code').push().key;

  db.ref().child(`code/${newKey}`).set({
    code,
  })
  .then(data => {
    cb(newKey);
  })
  .catch(err => console.log(err));
};

export const getCodeUpstream = (id, cb) => {
  db.ref(`code/${id}`).on('value', snapshot => {
    try {
      const data = snapshot.val();
      cb(data.code);
    } catch (error) {
      console.log(error);
    }
  });
};
