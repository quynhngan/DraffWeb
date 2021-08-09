import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cancel from './assets/cancel.png';
import './CollaboratorModal.scss';

function CollaboratorModal({ project }) {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .onSnapshot(doc => {
        if (doc.exists) {
          const arrayCollab = doc.data().collaborators;
          setCollaborators(arrayCollab);
        }
      });
  }, []);

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleSubmitCollaborator(e) {
    e.preventDefault();
    const email = e.target.elements['emailCollaborator'].value;

    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .update({
        collaborators: window.firebase.firestore.FieldValue.arrayUnion(email),
      })
      .then(function() {
        setEmail('');
      });
  }

  function removeCollaborator(collab) {
    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .update({
        collaborators: window.firebase.firestore.FieldValue.arrayRemove(collab),
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
        {project.name} <br /> Invite your team as collaborators!
      </div>
      <form className="email" onSubmit={handleSubmitCollaborator}>
        <input
          type="email"
          className="input-email input-email-collab"
          onChange={e => onChangeEmail(e)}
          required
          placeholder="collaborator's email"
          name="emailCollaborator"
          value={email}
        />

        <button className="send-email">SEND INVITATION</button>
      </form>
      <div className="collaborator-wrapper">
        <div className="title-text-collab">CURRENT COLLABORATORS</div>
        <div className="email-wrapper">
          <div className="title-text-collab">{project.owner} (Owner)</div>
          {collaborators.map(collab => (
            <div className="collab-email">
              <div className="title-text-collab">{collab}</div>
              <button
                className="btn-remove"
                onClick={() => removeCollaborator(collab)}
              >
                {' '}
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollaboratorModal;
