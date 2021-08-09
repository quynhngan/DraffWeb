import React, { useState, useRef, useEffect } from 'react';
import Annotation from '../Annotation';
import ProtectProject from '../ProtectProject';
import triangle from './images/triangle.png';
import logo from './images/logo.png';
import history from '../history';
import DeleteImage from '../DeleteImage';
import { Route } from 'react-router-dom';
import './ImageDetail.scss';

function ImageDetail({ id }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tempAnnotation, setTempAnnotation] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const imageElement = useRef(null);
  const [project, setProject] = useState({});
  const [isAllow, setIsAllow] = useState(false);
  const [isCollab, setIsCollab] = useState(false);
  const [description, setDescription] = useState('');
  const uuidv1 = require('uuid/v1');

  useEffect(() => {
    if (!localStorage.getItem('guestId')) {
      return localStorage.setItem('guestId', uuidv1());
    }
  }, []);
  useEffect(() => {
    window.firebase
      .firestore()
      .collection('images')
      .doc(id)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          setName(doc.data().name);
          setUrl(doc.data().url);
          setProjectId(doc.data().projectId);
          setDescription(doc.data().description);

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
            .where('projectId', '==', doc.data().projectId)
            .get()
            .then(function(querySnapshot) {
              if (!querySnapshot.empty) {
                console.log('111');
                querySnapshot.forEach(function(doc) {
                  const accessTime =
                    doc.data().accessAt.seconds * 1000 + 604800 * 1000;
                  const currentTime = new Date().getTime();
                  if (currentTime <= accessTime) {
                    setIsAllow(true);
                    console.log('mmm');
                  }
                });
              } else setIsAllow(false);
            });

          window.firebase
            .firestore()
            .collection('projects')
            .doc(doc.data().projectId)
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
                const emailCollaborator = doc
                  .data()
                  .collaborators.find(
                    collab => collab === localStorage.getItem('email')
                  );
                if (emailCollaborator) return setIsCollab(true);
              }
            });
        }
      });
  }, []);

  // listen on change
  useEffect(() => {
    window.firebase
      .firestore()
      .collection('annotations')
      .where('imageId', '==', id)
      .onSnapshot(querySnapshot => {
        const arrayAnnotations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAnnotations(arrayAnnotations);
      });
  }, []);

  function onHandleClick(e) {
    const offsetLeft = e.pageX - imageElement.current.offsetLeft - 10;
    const offsetTop = e.pageY - imageElement.current.offsetTop - 10;
    if (tempAnnotation) return setTempAnnotation(null);
    setTempAnnotation({
      top: offsetTop,
      left: offsetLeft,
      comments: [],
      visible: true,
    });
  }

  function handleClose(e) {
    var event = new Event('hideAllAnnotation');

    window.dispatchEvent(event);
  }

  function handlePasswordVerifySuccess() {
    setIsAllow(true);
  }

  function onChangeTextDescription(e) {
    setDescription(e.target.value);
  }
  function onChangeImageName(e) {
    setName(e.target.value);
  }

  function goBackProject() {
    history.push(`/projects/${projectId}`);
  }

  function submitDescription(e) {
    window.firebase
      .firestore()
      .collection('images')
      .doc(id)
      .set(
        {
          description: description,
        },
        { merge: true }
      );
  }

  function submitImageName(e) {
    if (name.length !== 0) {
      window.firebase
        .firestore()
        .collection('images')
        .doc(id)
        .set(
          {
            name: name,
          },
          { merge: true }
        );
    } else {
      window.firebase
        .firestore()
        .collection('images')
        .doc(id)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            setName(doc.data().name);
            console.log(doc.data().name);
          }
        });
    }
  }
  const isOwner = project.userId === localStorage.getItem('userId');
  const conditionRead = isCollab || isOwner;
  return (
    <div className="container-wrapper">
      <a className="navbar-brand pl-10 logo-alignment" href="/projects">
        <img className="draft-logo" src={logo} alt="logo" />
      </a>
      {!project.password || isOwner || isAllow || isCollab ? (
        <div className="image-detail-container">
          <div className="project-name">{project.name}</div>
          <div className="back-to-project" onClick={goBackProject}>
            <img className="triangle" src={triangle} alt="triangle" /> More from
            this project
          </div>

          <div className="name-image">
            <textarea
              readOnly={!conditionRead}
              onBlur={e => submitImageName(e)}
              className="name-image-text"
              placeholder="Image Name..."
              onChange={e => onChangeImageName(e)}
              value={name.split('.')[0]}
            />
          </div>

          <div classNAme="description-image">
            <textarea
              readOnly={!conditionRead}
              onBlur={e => submitDescription(e)}
              className="description-text"
              placeholder="Add description..."
              onChange={e => onChangeTextDescription(e)}
              value={description}
            />
          </div>
          <div
            className="image-wrapper"
            onClick={e => onHandleClick(e)}
            ref={imageElement}
          >
            <img className="image-detail" src={url} alt={name} />
            {tempAnnotation && (
              <Annotation
                annotation={tempAnnotation}
                imageId={id}
                onSubmit={() => setTempAnnotation(null)}
              />
            )}
            {annotations.map(annotation => (
              <Annotation annotation={annotation} imageId={id} />
            ))}
            <div className="annotation-overlay" onMouseEnter={handleClose} />
          </div>
        </div>
      ) : (
        <ProtectProject
          onSuccess={handlePasswordVerifySuccess}
          projectId={projectId}
        />
      )}

      {isCollab ||
        (isOwner && (
          <Route
            exact
            path="/images/:id/delete-image"
            render={() => (
              <DeleteImage
                imageName={name}
                imageId={id}
                project={project}
                projectId={projectId}
              />
            )}
          />
        ))}
    </div>
  );
}

export default ImageDetail;
