import React from 'react';
import { Link } from 'react-router-dom';
import './DeleteImage.scss';
import history from '../history';
import cancelSrc from '../../assets/cancel.png';
function DeleteImage({ imageId, projectId, imageName, project }) {
  const isOwner = project.userId === localStorage.getItem('userId');
  function deleteProject() {
    if (isOwner) {
      window.firebase
        .firestore()
        .collection('images')
        .doc(imageId)
        .delete()
        .then(function() {
          history.push(`/projects/${projectId}`);
        });
    }
  }
  function cancel() {
    history.push(`/projects/${projectId}`);
  }

  return (
    <div className="delete-project-container">
      <div className="button-cancel">
        <Link to="./">
          <img className="cancel-btn" src={cancelSrc} alt="cancel" />
        </Link>
      </div>
      <div className="title-text-delete">
        Are you sure? <br /> <span>Deleting a image is not reversable</span>
      </div>
      <div className="btn-delete-wrapper">
        <button className="btn-cancel" onClick={cancel}>
          I've changed my mind
        </button>
        <button className="btn-delete" onClick={deleteProject}>
          I understand, delete {imageName.split('.')[0]}
        </button>
      </div>
    </div>
  );
}

export default DeleteImage;
