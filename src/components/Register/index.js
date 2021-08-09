import React, { useState } from 'react';
import history from '../history';
import google from './assets/google.png';
import cancel from '../../assets/cancel.png';
import './Register.scss';

function Register({ closeOverlay, openLoginPage, onComplete }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState({});

  function loginWithGoogle(e) {
    e.preventDefault();

    var provider = new window.firebase.auth.GoogleAuthProvider();
    window.firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        if (window.location.pathname === '/') {
          history.push('/projects');
        } else closeOverlay();
        var user = result.user;
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('email', user.email);
      });
  }
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function changeName(e) {
    setUserName(e.target.value);
  }
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }
  function handleConfirmPassword(e) {
    setConfirmPass(e.target.value);
  }
  function handleSubmitRegister(e) {
    if (password !== confirmPass) {
      setErrors({
        ...errors,
        confirmError: 'confirm password is not match',
      });
    }
    e.preventDefault();
    window.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        result.user.updateProfile({
          displayName: userName,
        });
      })
      .then(function() {
        window.firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(function(result) {
            if (window.location.pathname === '/') {
              history.push('/projects');
            } else closeOverlay();
            var user = result.user;
            localStorage.setItem('userName', user.displayName);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('email', user.email);
            onComplete && onComplete();
          });
      })

      .catch(function(error) {
        setErrors({
          ...errors,
          registerError: error.message,
        });
      });
  }
  function closeRegister() {
    closeOverlay();
  }
  function openLogin() {
    openLoginPage();
  }
  return (
    <div className="register-container">
      <div onClick={closeRegister} className="button-cancel">
        <img className="cancel-btn" src={cancel} alt="cancel" />
      </div>
      <div className="title-text">
        Welcome to drafttt <br /> <span>Let's create an account</span>
      </div>
      <img
        className="google-signin-image"
        src={google}
        onClick={e => loginWithGoogle(e)}
        alt="google-sign-in"
      />
      <div className="text">OR:</div>
      <form className="form-container" onSubmit={handleSubmitRegister}>
        <div className="error-text">{errors.registerError}</div>
        <input
          className="input-form"
          type="text"
          placeholder="Email Address"
          onChange={e => handleChangeEmail(e)}
          value={email}
        />
        <input
          className="input-form"
          type="text"
          placeholder="Display Name"
          onChange={e => changeName(e)}
          value={userName}
        />
        <input
          className="input-form"
          type="password"
          placeholder="Password"
          onChange={e => handleChangePassword(e)}
          value={password}
        />
        <input
          className="input-form"
          type="password"
          placeholder="Repeat password"
          onChange={e => handleConfirmPassword(e)}
          value={confirmPass}
        />
        <div className="error-text">{errors.confirmError}</div>
        <button className="register-button">LET'S GO</button>
      </form>
      <div className="text-blue" onClick={openLogin}>
        Already have an account? Let’s login here
      </div>
    </div>
  );
}

export default Register;
