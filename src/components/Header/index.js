/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, Fragment } from 'react';
import history from '../history';
import logo2 from './assets/logo2.png';
import './Header.scss';
import Login from '../Login';
import Register from '../Register';
import { User } from '../UserContext';
function Header({ myproject }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const userCurrent = useContext(User);
  function openGetStarted() {
    setOpenRegister(true);
    setOpenLogin(false);
  }
  function openLoginPage() {
    setOpenLogin(true);
    setOpenRegister(false);
  }
  function closeOverlay() {
    setOpenLogin(false);
    setOpenRegister(false);
  }
  function handleLogout() {
    window.firebase
      .auth()
      .signOut()
      .then(function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        history.push('/');
      })
      .catch(function() {
        // An error happened.
      });
  }
  function goToMyProject() {
    history.push('/projects');
  }
  return (
    <div className="header-container-wrapper">
      <div className="header-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-3">
          <a className="navbar-brand pl-10 text-color" href="/projects">
            <img className="draft-logo" src={logo2} alt="logo" />
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {userCurrent ? (
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <li className="nav-item">
                    <div
                      onClick={goToMyProject}
                      className="nav-link text-color user-name"
                    >
                      My Account
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="nav-link text-color user-name">|</div>
                  </li>
                  {myproject && (
                    <Fragment>
                      <li className="nav-item">
                        <div
                          onClick={goToMyProject}
                          className="nav-link text-color"
                        >
                          My Projects
                        </div>
                      </li>
                      <li className="nav-item">
                        <div className="nav-link text-color user-name">|</div>
                      </li>
                    </Fragment>
                  )}
                  <li className="nav-item">
                    <a className="nav-link text-color" onClick={handleLogout}>
                      Log Out
                    </a>
                  </li>
                </div>
              ) : (
                <a className="nav-link text-color" onClick={openLoginPage}>
                  Log in
                </a>
              )}
            </ul>
          </div>
        </nav>
      </div>
      {openLogin && (
        <Login closeOverlay={closeOverlay} openGetStarted={openGetStarted} />
      )}
      {openRegister && (
        <Register closeOverlay={closeOverlay} openLoginPage={openLoginPage} />
      )}
    </div>
  );
}

export default Header;
