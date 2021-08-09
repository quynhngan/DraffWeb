import React, { useState, useEffect } from 'react';
import history from '../history';
import projectSrc from './assets/project.png';
import './Project.scss';
function Project({ project, myProject, collab }) {
  const [clickRight, setClickRight] = useState(false);
  const [images, setImages] = useState([]);

  function shareLink() {
    var textField = document.createElement('textarea');
    textField.innerText = `${window.location.href}/${project.id}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('images')
      .where('projectId', '==', project.id)
      .orderBy('createdAt', 'asc')
      .onSnapshot(querySnapshot => {
        const images = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          description: '',
        }));

        setImages(images);
      });
  }, []);

  function openProjectDetail(e) {
    if (e.nativeEvent.which === 1) {
      history.push(`/projects/${project.id}`);
    } else if (e.nativeEvent.which === 3) {
      e.nativeEvent.preventDefault();
      setClickRight(true);
    }
  }

  function openCollaborator() {
    history.push(`/projects/${project.id}/invite-collaborators`);
  }

  function openDeleteProject() {
    history.push(`/projects/${project.id}/delete-project`);
  }

  function openRename() {
    history.push(`/projects/${project.id}/edit-project`);
  }

  function leaveProject() {
    window.firebase
      .firestore()
      .collection('projects')
      .doc(project.id)
      .update({
        collaborators: window.firebase.firestore.FieldValue.arrayRemove(
          localStorage.getItem('email')
        ),
      });
  }

  function duplicateProject() {
    window.firebase
      .firestore()
      .collection('projects')
      .add({
        userId: localStorage.getItem('userId'),
        name: project.name,
        password: false,
        collaborators: [],
        owner: localStorage.getItem('email'),
      })
      .then(function(doc) {
        images.forEach(item => {
          window.firebase
            .firestore()
            .collection('images')
            .add({
              url: item.url,
              name: item.name,
              projectId: doc.id,
              createdAt: item.createdAt,
              description: item.description,
            });
        });
      });
  }

  return (
    <div>
      {clickRight ? (
        <div className="project-container">
          <div
            className="context-menu"
            onMouseLeave={() => setClickRight(false)}
          >
            <div className="project-name">{project.name}</div>
            <div onClick={shareLink} className="menu-text">
              Share Link
            </div>
            <div onClick={openCollaborator} className="menu-text">
              Invite Collaborator
            </div>
            <div onClick={openRename} className="menu-text">
              Rename
            </div>
            <div onClick={duplicateProject} className="menu-text">
              Duplicate
            </div>
            {myProject && (
              <div onClick={openDeleteProject} className="menu-text">
                Delete
              </div>
            )}
            {collab && (
              <div onClick={leaveProject} className="menu-text">
                Leave Project
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="project-container">
          <div
            className="project-box"
            onClick={e => openProjectDetail(e)}
            onContextMenu={e => openProjectDetail(e)}
            style={{
              backgroundImage: images[0]
                ? `url('${images[0].url}')`
                : `url(' ${projectSrc}')`,
            }}
          >
            <div className="project-name"> {project.name} </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Project;
