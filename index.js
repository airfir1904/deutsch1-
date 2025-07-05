const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// 👉 Tạo object serviceAccount từ biến môi trường:
const serviceAccount = {
  "type": process.env.FB_TYPE,
  "project_id": process.env.FB_PROJECT_ID,
  "private_key_id": process.env.FB_PRIVATE_KEY_ID,
  "private_key": process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FB_CLIENT_EMAIL,
  "client_id": process.env.FB_CLIENT_ID,
  "auth_uri": process.env.FB_AUTH_URI,
  "token_uri": process.env.FB_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FB_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://deutschsprache-a2005.firebaseio.com'
});

const db = admin.database();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📌 Endpoint để lưu dữ liệu:
app.post('/save', (req, res) => {
  const data = req.body;
  db.ref('users').push(data);
  res.json({ status: 'success', data });
});

// 📌 Endpoint để lấy toàn bộ dữ liệu:
app.get('/all', async (req, res) => {
  const ref = db.ref('users');
  ref.once('value', (snapshot) => {
    res.json(snapshot.val());
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
