import React, { useState, useEffect } from 'react';
import Project from '../Project';
import no_collab from './assets/no_collab.png';
import no_visited from './assets/no_visited.png';
import loading from './assets/loading.gif';
import cancel from '../../assets/cancel.png';
import history from '../history';
import './ProjectList.scss';

function ProjectList() {
  const [close, setClose] = useState(false);
  const [nameProject, setNameProject] = useState('');
  const [projects, setProjects] = useState(null);
  const [collabProjects, setCollabProjects] = useState(null);
  const [visitedProjects, setVisitedProjects] = useState(null);
  const [onSubmit, setOnSubmit] = useState(false);
  useEffect(() => {
    window.firebase
      .firestore()
      .collection('projects')
      .where('userId', '==', localStorage.getItem('userId'))
      .onSnapshot(proj => {
        const arrProjects = proj.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(arrProjects);
      });
  }, []);

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('visitedProjects')
      .where('userId', '==', localStorage.getItem('userId'))
      .orderBy('visitedAt', 'desc')
      .onSnapshot(proj => {
        const arrProjects = proj.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const apProjects = arrProjects.map(proj =>
          window.firebase
            .firestore()
            .collection('projects')
            .doc(proj.projectId)
            .get()
        );
        Promise.all(apProjects).then(pros => {
          const arrVisitedProjects = pros.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVisitedProjects(arrVisitedProjects);
        });
      });
  }, []);

  useEffect(() => {
    localStorage.getItem('email') &&
      window.firebase
        .firestore()
        .collection('projects')
        .where('collaborators', 'array-contains', localStorage.getItem('email'))
        .onSnapshot(proj => {
          const arrProjects = proj.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setCollabProjects(arrProjects);
        });
  }, []);
  function closeOverlay() {
    setClose(false);
  }
  function openOverlay() {
    setClose(true);
  }
  function handleChange(e) {
    setNameProject(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    setOnSubmit(true);
    window.firebase
      .firestore()
      .collection('projects')
      .add({
        userId: localStorage.getItem('userId'),
        name: nameProject,
        password: false,
        collaborators: [],
        owner: localStorage.getItem('email'),
      })
      .then(function(docRef) {
        history.push(`/projects/${docRef.id}`);
        setProjects([
          ...projects,
          {
            name: nameProject,
            userId: localStorage.getItem('userId'),
            id: docRef.id,
            password: false,
            collaborators: [],
            owner: localStorage.getItem('email'),
          },
        ]);
        setNameProject('');
        setClose(false);
      });
  }

  if (!projects || !collabProjects || !visitedProjects) {
    return (
      <div className="container-wrapper loading-wrapper">
        <img className="loading" src={loading} alt="loading" />
      </div>
    );
  }
  return (
    <div className="container-wrapper">
      <div className="project-list-container">
        <div
          className="project"
          // style={{ filter: close ? 'blur(4px)' : 'none' }}
        >
          <div className="my-project">
            <div className="text-project">MY PROJECTS</div>
            <div className="box-project-create">
              <div className="project-wrapper">
                <button className="project-create-button" onClick={openOverlay}>
                  <div className="plus-icon"> + </div>
                  <div className="text-create-project">CREATE NEW PROJECT</div>
                </button>
                {projects.map(project => (
                  <Project
                    myProject={true}
                    project={project}
                    key={project.id}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="collab-project">
            <div className="text-project-collab">COLLABORATING PROJECTS</div>
            {collabProjects.length > 0 ? (
              <div className="project-wrapper">
                {collabProjects.map(project => (
                  <Project collab={true} project={project} key={project.id} />
                ))}
              </div>
            ) : (
              <div className="project-wrapper">
                <img className="draft-logo" src={no_collab} alt="logo" />
              </div>
            )}
          </div>
          <div className="visted-project">
            <div className="text-project-collab">PROJECTS YOU HAVE VISITED</div>
            {visitedProjects.length > 0 ? (
              <div className="project-wrapper">
                {visitedProjects.map(project => (
                  <Project project={project} key={project.id} />
                ))}
              </div>
            ) : (
              <div className="project-wrapper">
                <img className="draft-logo" src={no_visited} alt="no_visited" />
              </div>
            )}
          </div>
          <div
            className="create-new-project"
            style={{ display: close ? 'block' : 'none' }}
          >
            <div className="button-cancel" onClick={closeOverlay}>
              <img className="cancel-btn" src={cancel} alt="cancel" />
            </div>
            <div className="title-text-create">
              A new project! <br /> <span> What shall we call it?</span>
            </div>
            <form className="project-name" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-project-name"
                placeholder="Your Project Name"
                name="project-name"
                onChange={e => handleChange(e)}
                value={nameProject}
              />
              <button disabled={onSubmit} className="lets-go">
                LET'S GO
              </button>
            </form>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
}

export default ProjectList;
