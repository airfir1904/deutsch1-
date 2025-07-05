const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deutschsprache-a2005.firebaseio.com'
});

const db = admin.database();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const data = req.body;
  db.ref('users').push(data);
  res.json({ status: 'success', data });
});

app.get('/all', async (req, res) => {
  const ref = db.ref('users');
  ref.once('value', (snapshot) => {
    res.json(snapshot.val());
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
