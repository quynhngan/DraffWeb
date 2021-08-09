import React, { useState } from 'react';
// import Dropzone from 'react-dropzone';
import logo from './assets/logo.png';
// import imageUpload from './assets/image.png';
import explain from './assets/explain.png';
import password from './assets/password.png';
import feedback from './assets/feedback.png';
import projects from './assets/projects.png';
import history from '../history';
import Register from '../Register';
import Login from '../Login';
import './Dashboard.scss';

function Dashboard() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  if (localStorage.getItem('userId')) {
    history.push('/projects');
  }
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
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        history.push('/');
      })
      .catch(function() {
        // An error happened.
      });
  }
  return (
    <div className="dashboard-container">
      {openLogin && (
        <Login closeOverlay={closeOverlay} openGetStarted={openGetStarted} />
      )}
      {openRegister && (
        <Register closeOverlay={closeOverlay} openLoginPage={openLoginPage} />
      )}
      <div className="dashboard-wrapper">
        {localStorage.getItem('userName') ? (
          <div className="btn-wrapper">
            <div className="userName">{localStorage.getItem('userName')}</div>
            <div onClick={handleLogout} className="log-out">
              Log out{' '}
            </div>
          </div>
        ) : (
          <div className="btn-wrapper">
            <button className="btn btn-start" onClick={openGetStarted}>
              GET STARTED
            </button>
            <button className="btn btn-login" onClick={openLoginPage}>
              {' '}
              LOGIN{' '}
            </button>
          </div>
        )}

        <div className="logo-wrapper">
          <div className="logo">
            <img className="draft-logo" src={logo} alt="logo" />
          </div>
          <div className="slogan">
            <div className="slogan-text">
              Get fast and secure feedback on your designs from your
              <div className="slidingVertical">
                <span>team</span>
                <span>peers</span>
                <span>clients</span>
                <span>developers</span>
                <span>product managers</span>
                <span>boss</span>
                <span>friends</span>
              </div>
            </div>
            <div className="slogan-text-small">
              The easiest way to share your designs for <br /> real-time
              collaborative annotation and review.
            </div>
          </div>
        </div>

        {/* <div className="drag-drop">
          <Dropzone>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className="box-upload" {...getRootProps()}>
                  <input
                    id="upload-file"
                    style={{ visibility: 'hidden', display: 'none' }}
                    {...getInputProps()}
                  />
                  <p className="text-inside-box">
                    Drag & drop one or more image files here <br /> to see how
                    it works
                  </p>
                  <img className="style" src={imageUpload} alt="upload" />
                </div>
              </section>
            )}
          </Dropzone>
        </div> */}
        <div className="section-1">
          <div className="text-wrapper">
            <div className="description-text">Explain your design thinking</div>
            <div className="description-text-small">
              Annotate your comps with design commentary to walk your
              stakeholders through your decisions
            </div>
          </div>
          <div className="image-wrapper">
            <img className="image-dashboard" src={explain} alt="explain" />
          </div>
        </div>
        <div className="section-1">
          <div className="image-wrapper">
            <img className="image-dashboard" src={feedback} alt="feedback" />
          </div>
          <div className="text-wrapper">
            <div className="description-text">Get real-time feedback </div>
            <div className="description-text-small">
              Feedback and comments show up in real-time as they are added to
              your images.
            </div>
          </div>
        </div>
        <div className="section-1">
          <div className="text-wrapper">
            <div className="description-text">Work on multiple projects</div>
            <div className="description-text-small">
              Keep your screens organized by projects so they are shared with
              the right people.You can also tag your screens for additional
              organization within projects.
            </div>
          </div>
          <div className="image-wrapper">
            <img className="image-dashboard" src={projects} alt="projects" />
          </div>
        </div>
        <div className="section-1">
          <div className="image-wrapper">
            <img className="image-dashboard" src={password} alt="password" />
          </div>
          <div className="text-wrapper">
            <div className="description-text">Secure your ideas </div>
            <div className="description-text-small">
              Turn on password-protection on any of your projects to ensure that
              prying eyes can’t see what you’re working on before its ready for
              the world.
            </div>
          </div>
        </div>
      </div>
      <div className="banner-container">
        <div className="banner-wrapper">
          <div className="banner-text">Get your designs right</div>
          <div className="banner-text-small">
            Start using drafttt for free today to <br /> streamline your design
            review process
          </div>
          <button onClick={openGetStarted} className="btn-lets-go">
            LET'S GO
          </button>
        </div>
      </div>
      <div className="footer-text">
        At 2359, we create hundreds of designs a year for our clients to review.
        We built drafttt to <br /> compliment our workflow and we’re more than
        pleased to share it with you.
      </div>
    </div>
  );
}

export default Dashboard;
