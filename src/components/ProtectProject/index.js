import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import hide_pass from './assets/hide_pass.png';
import show_pass from './assets/show_pass.png';
import './Protect.scss';
function ProtectProject({ projectId, onSuccess }) {
  const [projectPass, setProjectPass] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const uuidv1 = require('uuid/v1');

  useEffect(() => {
    if (!localStorage.getItem('guestId')) {
      return localStorage.setItem('guestId', uuidv1());
    }
  }, []);
  function handleChangePassword(e) {
    setProjectPass(e.target.value);
  }

  function submitPassword(e) {
    e.preventDefault();
    window.firebase
      .firestore()
      .collection('passwordUser')
      .where(
        'userId',
        '==',
        localStorage.getItem('userId')
          ? localStorage.getItem('userId')
          : localStorage.getItem('guestId')
      )
      .where('projectId', '==', projectId)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function(doc) {
            const accessTime =
              doc.data().accessAt.seconds * 1000 + 604800 * 1000;
            const currentTime = new Date().getTime();
            if (currentTime >= accessTime) {
              fetch(
                'https://us-central1-design-pen-staging.cloudfunctions.net/api/passwordVerify',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    projectId: projectId,
                    password: projectPass,
                  }),
                }
              )
                .then(res => {
                  if (res.status !== 200) {
                    throw new Error('Password invalid');
                  }
                  onSuccess();
                })
                .catch(err => {
                  setError('Password invalid');
                });
            }
          });
        } else {
          fetch(
            'https://us-central1-design-pen-staging.cloudfunctions.net/api/passwordVerify',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                projectId: projectId,
                password: projectPass,
              }),
            }
          )
            .then(res => {
              if (res.status !== 200) {
                throw new Error('Password invalid');
              }
              window.firebase
                .firestore()
                .collection('passwordUser')
                .add({
                  userId: localStorage.getItem('userId')
                    ? localStorage.getItem('userId')
                    : localStorage.getItem('guestId'),
                  accessAt: window.firebase.firestore.Timestamp.now(),
                  projectId: projectId,
                });
              onSuccess();
            })
            .catch(err => {
              setError('Password incorrect');
            });
        }
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }
  return (
    <div className="protect-container">
      <img className="logo" src={logo} alt="logo" />
      <div className="title-text">
        Making collaborative design reviews simpler
      </div>
      <div className="title-text-small">
        The project you are about to access is secured with a password <br />
        Please enter the password to proceed
      </div>
      <form className="form-wrapper" onSubmit={submitPassword}>
        <div className="password-wrapper">
          <input
            className="input-form"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            onChange={e => handleChangePassword(e)}
            value={projectPass}
          />
          {showPass ? (
            <img
              onClick={() => setShowPass(false)}
              className="pass-icon"
              src={show_pass}
              alt="show_pass"
            />
          ) : (
            <img
              onClick={() => setShowPass(true)}
              className="pass-icon"
              src={hide_pass}
              alt="show_pass"
            />
          )}
        </div>

        {error && <span className="error-text">{error}</span>}
        <button className="btn-check">CONTINUE</button>
      </form>
    </div>
  );
}
export default ProtectProject;
