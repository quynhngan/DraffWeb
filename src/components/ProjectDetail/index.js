import React, { useState, useEffect, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import Header from '../../components/Header';
import ProjectListItemUpload from '../ProjectListItemUpload';
import ProjectListItem from '../ProjectListItem';
import ProtectProject from '../ProtectProject';
import ProjectSetting from '../ProjectSetting';
import CreateProjectPasswordModal from '../CreateProjectPasswordModal';
import EditProjectName from '../EditProjectName';
import CollaboratorModal from '../CollaboratorModal';
import DeleteProject from '../DeleteProject';
import loading from './asset/loading.gif';
import upload from './asset/upload.png';
import './ProjectDetail.scss';

function ProjectDetail({ id }) {
  const [imgData, setImage] = useState([]);
  const [projectImages, setProjectImages] = useState([]);
  const [project, setProject] = useState(null);
  const [isAllow, setIsAllow] = useState(false);
  const [isCollab, setIsCollab] = useState(false);
  const [uploadImageIds, setUploadImageIds] = useState({});
  const [showLoading, setShowLoading] = useState(true);
  const uuidv1 = require('uuid/v1');

  useEffect(() => {
    if (!localStorage.getItem('guestId')) {
      return localStorage.setItem('guestId', uuidv1());
    }
  }, []);

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('projects')
      .doc(id)
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

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('passwordUser')
      .where(
        'userId',
        '==',
        localStorage.getItem('userId')
          ? localStorage.getItem('userId')
          : localStorage.getItem('guestId')
      )
      .where('projectId', '==', id)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function(doc) {
            const accessTime =
              doc.data().accessAt.seconds * 1000 + 604800 * 1000;
            const currentTime = new Date().getTime();
            if (currentTime <= accessTime) {
              setIsAllow(true);
            }
          });
        } else setIsAllow(false);
      });
  }, []);

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('projects')
      .doc(id)
      .onSnapshot(doc => {
        if (doc.exists) {
          setProject({
            id: id,
            name: doc.data().name,
            userId: doc.data().userId,
            password: doc.data().password,
            owner: doc.data().owner,
            collaborators: doc.data().collaborators,
          });
          const Owner = doc.data().userId === localStorage.getItem('userId');

          if (!Owner) {
            window.firebase
              .firestore()
              .collection('visitedProjects')
              .where('userId', '==', localStorage.getItem('userId'))
              .get()
              .then(proj => {
                const arrProjects = proj.docs.find(
                  doc => doc.data().projectId === id
                );
                if (!arrProjects) {
                  window.firebase
                    .firestore()
                    .collection('visitedProjects')
                    .add({
                      projectId: id,
                      visitedAt: window.firebase.firestore.Timestamp.now(),
                      userId: localStorage.getItem('userId'),
                    });
                } else {
                  window.firebase
                    .firestore()
                    .collection('visitedProjects')
                    .doc(arrProjects.id)
                    .set(
                      {
                        visitedAt: window.firebase.firestore.Timestamp.now(),
                      },
                      { merge: true }
                    );
                }
              });
          }
        }
      });
  }, []);

  useEffect(() => {
    window.firebase
      .firestore()
      .collection('images')
      .where('projectId', '==', id)
      .orderBy('createdAt', 'asc')
      .get()
      .then(querySnapshot => {
        const images = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          description: '',
        }));
        setTimeout(() => {
          setProjectImages(images);
          setShowLoading(false);
        }, 1000);
      });
  }, []);
  function handlePasswordVerifySuccess() {
    setIsAllow(true);
  }
  function onDropImage(files) {
    if (files && files[0]) {
      setImage([...imgData, ...files]);
    }
  }

  function handleUploadImageComplete(imageData) {
    const { id } = imageData;
    setUploadImageIds(prevState => ({
      ...prevState,
      [id]: true,
    }));
  }

  if (!project || showLoading) {
    return (
      <div className="container-wrapper loading-wrapper">
        <img className="loading" src={loading} alt="loading" />
      </div>
    );
  }
  const isOwner = project.userId === localStorage.getItem('userId');
  return (
    <Fragment>
      {!project.password || isOwner || isAllow || isCollab ? (
        <Fragment>
          <Header myproject={true} />
          <div className="container-wrapper">
            <div className="project-detail-container">
              <div className="upload-image-container">
                <div className="project-name">Project: {project.name}</div>
                {(imgData.length === 0 &&
                  projectImages.length === 0 &&
                  isCollab) ||
                (imgData.length === 0 &&
                  projectImages.length === 0 &&
                  isOwner) ? (
                  <div className="drag-drop">
                    <Dropzone onDrop={onDropImage}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div className="upload-image" {...getRootProps()}>
                            <input
                              id="upload-file"
                              style={{ visibility: 'hidden', display: 'none' }}
                              {...getInputProps()}
                            />
                            <p className="text-inside-box">
                              Drag & drop one or more image files here <br /> to
                              see how it works
                            </p>
                            <img className="style" src={upload} alt="upload" />
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                ) : (
                  ''
                )}
                <div id="projectImage" className="project-detail-images">
                  {projectImages
                    .filter(image => !uploadImageIds[image.id])
                    .map(image => (
                      <ProjectListItem
                        key={image.id}
                        image={image}
                        projectId={id}
                        project={project}
                        isCollab={isCollab}
                        isOwner={isOwner}
                      />
                    ))}
                  {imgData.map(file => (
                    <ProjectListItemUpload
                      key={id}
                      projectId={id}
                      file={file}
                      onComplete={handleUploadImageComplete}
                      project={project}
                      isCollab={isCollab}
                      isOwner={isOwner}
                    />
                  ))}
                  {(projectImages.length !== 0 && isCollab) ||
                  (imgData.length !== 0 && isCollab) ||
                  (imgData.length !== 0 && isOwner) ||
                  (projectImages.length !== 0 && isOwner) ? (
                    <div className="upload-image-box-container">
                      <Dropzone onDrop={onDropImage}>
                        {({ getRootProps, getInputProps }) => (
                          <div className="upload-image-box" {...getRootProps()}>
                            <input
                              id="upload-file"
                              style={{ visibility: 'hidden', display: 'none' }}
                              {...getInputProps()}
                            />
                            <div className="plus-icon"> + </div>
                          </div>
                        )}
                      </Dropzone>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <ProjectSetting project={project} />
            </div>
          </div>
        </Fragment>
      ) : (
        <ProtectProject
          onSuccess={handlePasswordVerifySuccess}
          projectId={id}
        />
      )}
      {isOwner && (
        <Route
          exact
          path="/projects/:id/set-password"
          render={() => <CreateProjectPasswordModal project={project} />}
        />
      )}
      {(isOwner || isCollab) && (
        <Fragment>
          <Route
            exact
            path="/projects/:id/invite-collaborators"
            render={() => <CollaboratorModal project={project} />}
          />
          <Route
            exact
            path="/projects/:id/delete-project"
            render={() => <DeleteProject project={project} />}
          />

          <Route
            exact
            path="/projects/:id/edit-project"
            render={() => <EditProjectName project={project} />}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default ProjectDetail;
