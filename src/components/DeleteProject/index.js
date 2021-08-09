import React from 'react';
import { Link } from 'react-router-dom';
import './DeleteProject.scss';
import history from '../history';
import cancelSrc from '../../assets/cancel.png';
function DeleteProject({ project }) {
  const isOwner = project.userId === localStorage.getItem('userId');
  function deleteProject() {
    if (isOwner) {
      window.firebase
        .firestore()
        .collection('projects')
        .doc(project.id)
        .delete()
        .then(function() {
          history.push('/projects');
        });
    }
  }
  function cancel() {
    history.push(`/projects/${project.id}`);
  }

  return (
    <div className="delete-project-container">
      <div className="button-cancel">
        <Link to="./">
          <img className="cancel-btn" src={cancelSrc} alt="cancel" />
        </Link>
      </div>
      <div className="title-text-delete">
        Are you sure? <br /> <span>Deleting a project is not reversable</span>
      </div>
      <div className="btn-delete-wrapper">
        <button className="btn-cancel" onClick={cancel}>
          I've changed my mind
        </button>
        <button className="btn-delete" onClick={deleteProject}>
          I understand, delete {project.name}
        </button>
      </div>
    </div>
  );
}

export default DeleteProject;
