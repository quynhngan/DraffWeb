const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

admin.initializeApp();

app.post('/passwordVerify', async (req, res) => {
  const { projectId, password } = req.body;

  if (!projectId || !password) {
    return res.status(400).send('Missing param projectId or password');
  }

  try {
    const verifyPasswordQuery = await admin
      .firestore()
      .collection('projectPasswords')
      .doc(projectId)
      .get();

    if (
      verifyPasswordQuery.empty ||
      password !== verifyPasswordQuery.data().password
    ) {
      throw new Error('Invalid password!');
    }

    return res.send('OK');
  } catch (error) {
    return res.status(400).send(error);
  }
});

exports.api = functions.https.onRequest(app);
