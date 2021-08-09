import React, { useState } from 'react';
import history from '../history';
import google from './assets/google.png';
import cancel from '../../assets/cancel.png';
import './Login.scss';

function Login({ closeOverlay, openGetStarted }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmitLogin(e) {
    e.preventDefault();
    window.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function(result) {
        history.push('/projects');
        var user = result.user;
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('email', user.email);
      })
      .catch(function(error) {
        if (
          error.message ===
          'The password is invalid or the user does not have a password.'
        ) {
          setErrors({
            ...errors,
            loginError: 'Invalid password. Please try again.',
          });
        } else
          setErrors({
            ...errors,
            loginError: error.message,
          });
      });
  }

  function closeLogin() {
    closeOverlay();
  }

  function goToRegister() {
    openGetStarted();
  }
  return (
    <div className="register-container">
      <div onClick={closeLogin} className="button-cancel">
        <img className="cancel-btn" src={cancel} alt="cancel" />
      </div>
      <div className="title-text">
        You're back! <br /> <span>Let's login to your account</span>
      </div>
      <img
        className="google-signin-image"
        src={google}
        onClick={e => loginWithGoogle(e)}
        alt="google-sign-in"
      />
      <div className="text">OR:</div>

      <form className="form-container" onSubmit={handleSubmitLogin}>
        <div className="error-text">{errors.loginError}</div>
        <input
          className="input-form"
          type="text"
          placeholder="Your Email Address"
          onChange={e => handleChangeEmail(e)}
          value={email}
        />
        <input
          className="input-form"
          type="password"
          placeholder="Password"
          onChange={e => handleChangePassword(e)}
          value={password}
        />

        <button className="login-button">LET'S GO</button>
      </form>
      <div onClick={goToRegister} className="text-blue">
        New to drafttt? Create a new account here
      </div>
    </div>
  );
}

export default Login;
