import React, { useState, useRef, useEffect } from 'react';
import Switch from '../Switch';
import history from '../history';
import logo_footer from './assets/logo_footer.png';
import './ProjectSetting.scss';

function ProjectSetting({ project }) {
  const isOwner = project.userId === localStorage.getItem('userId');
  const [copySuccess, setCopySuccess] = useState('');
  const [isCollab, setIsCollab] = useState(false);
  const link = useRef(null);

  function copyToClipboard(e) {
    link.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
    setTimeout(function() {
      setCopySuccess('');
    }, 1000);
  }

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      setIsCollab(false);
    } else
      window.firebase
        .firestore()
        .collection('projects')
        .doc(project.id)
        .onSnapshot(doc => {
          if (doc.exists) {
            const emailCollaborator = doc
              .data()
              .collaborators.find(
                collab => collab === localStorage.getItem('email')
              );
            if (emailCollaborator) return setIsCollab(true);
          }
        });
  }, []);
  function onChangeValue() {
    if (!project.password) {
      return history.push(`/projects/${project.id}/set-password`);
    }
    //remove password
    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .set(
        {
          password: false,
        },
        { merge: true }
      );
  }

  function openCollaborator() {
    history.push(`/projects/${project.id}/invite-collaborators`);
  }
  function openDeleteProject() {
    history.push(`/projects/${project.id}/delete-project`);
  }

  return (
    <div className="project-setting-container">
      {document.queryCommandSupported('copy') && (
        <div className="share-link-project">
          <div className="basic-text"> Share link </div>
          <div className="link-project" onClick={copyToClipboard}>
            <input
              readOnly
              className="input-text-disable"
              ref={link}
              value={window.location.href}
            />
          </div>
          {copySuccess}
        </div>
      )}
      {isOwner && (
        <div className="password-protect">
          <div className="basic-text"> Password Protect</div>
          <Switch checked={project.password} onChangeValue={onChangeValue} />
        </div>
      )}
      <div className="btn-wrapper">
        {isOwner || isCollab ? (
          <button className="btn-collab" onClick={openCollaborator}>
            COLLABORATORS
          </button>
        ) : (
          ''
        )}

        {isOwner && (
          <button className="btn-delete" onClick={openDeleteProject}>
            DELETE PROJECT
          </button>
        )}
      </div>
      <div className="footer">
        <img src={logo_footer} className="logo-footer" alt="logo" />
      </div>
    </div>
  );
}

export default ProjectSetting;
