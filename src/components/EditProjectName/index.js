import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import history from '../history';
import './EditProjectName.scss';
import cancel from '../../assets/cancel.png';
function EditProjectName({ project }) {
  const [name, setName] = useState('');

  function onChangeName(e) {
    setName(e.target.value);
  }
  function handleSubmitProjectName(e) {
    e.preventDefault();
    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .update({
        name: name,
      })
      .then(function() {
        history.goBack();
      });
  }

  return (
    <div className="create-password">
      <div className="button-cancel">
        <Link to="./">
          <img className="cancel-btn" src={cancel} alt="cancel" />
        </Link>
      </div>
      <div className="title-text-create">
        {project.name} <br /> Change your project's name!
      </div>
      <form className="project-name-form" onSubmit={handleSubmitProjectName}>
        <input
          type="text"
          className="project-name-input"
          onChange={e => onChangeName(e)}
          required
          placeholder="Project's Name"
          name="nameProject"
          value={name}
        />

        <button className="btn-change">CHANGE</button>
      </form>
    </div>
  );
}

export default EditProjectName;
