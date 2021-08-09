import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hide_pass from './assets/hide_pass.png';
import show_pass from './assets/show_pass.png';
import './CreateProjectPasswordModal.scss';
import history from '../history';
import cancel from '../../assets/cancel.png';
function CreateProjectPasswordModal({ project }) {
  const [showPass, setShowPass] = useState(false);
  function handleSubmitPass(e) {
    e.preventDefault();
    const password = e.target.elements['projectPassword'].value;
    window.firebase
      .firestore()
      .collection('projectPasswords')
      .doc(project.id)
      .set({
        password: password,
      })
      .then(function() {
        return history.push(`/projects/${project.id}`);
      });

    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .set(
        {
          password: true,
        },
        { merge: true }
      )
      .then(
        window.firebase
          .firestore()
          .collection('passwordUser')
          .where('projectId', '==', project.id)
          .get()
          .then(function(querySnapshot) {
            if (!querySnapshot.empty) {
              querySnapshot.forEach(function(doc) {
                window.firebase
                  .firestore()
                  .collection('passwordUser')
                  .doc(doc.id)
                  .delete();
              });
            }
          })
      );
  }

  return (
    <div className="create-password">
      <div className="button-cancel">
        <Link to="./">
          <img className="cancel-btn" src={cancel} alt="cancel" />
        </Link>
      </div>
      <div className="title-text-create">
        {project.name} <br /> <span> Keep your idea under wraps</span>
      </div>
      <form
        name="projectPasswordForm"
        className="password"
        onSubmit={handleSubmitPass}
      >
        {showPass ? (
          <div className="password-wrapper">
            <input
              type="text"
              required
              name="projectPassword"
              className="input-password"
              placeholder="password"
            />
            <img
              onClick={() => setShowPass(false)}
              className="pass-icon"
              src={show_pass}
              alt="show_pass"
            />
          </div>
        ) : (
          <div className="password-wrapper">
            <input
              type="password"
              required
              name="projectPassword"
              className="input-password"
              placeholder="password"
            />
            <img
              onClick={() => setShowPass(true)}
              className="pass-icon"
              src={hide_pass}
              alt="show_pass"
            />
          </div>
        )}
        <button className="set-password">SET PASSWORD</button>
      </form>
      <div className="description-footer">
        <div className="description-text">
          {' '}
          Setting a password ensures that your designs cannot be viewed by
          prying eyes. Anyone who gets a link to the project will need the
          password to access it.
          <br />{' '}
          <span>
            Collaborators have access to the project without the password.
          </span>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectPasswordModal;
