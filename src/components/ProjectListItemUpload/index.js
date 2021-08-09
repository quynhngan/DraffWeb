import React, { useEffect, useState } from 'react';
import upload from '../../firebase/upload';
import { addProjectImage } from '../../firebase';
import ProgressIndicator from '../ProgressIndicator';
import history from '../history';
import './ProjectListItemUpload.scss';
const uuidv1 = require('uuid/v1');
const getImageFromFile = file => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      reject(e);
    };

    reader.readAsDataURL(file);
  });
};

function ProjectListItemUpload({
  file,
  projectId,
  onComplete,
  project,
  isCollab,
  isOwner,
}) {
  const [imageData, setImageData] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [imageId, setImageId] = useState(null);
  const [clickRight, setClickRight] = useState(false);
  const uuid = uuidv1();
  useEffect(() => {
    getImageFromFile(file).then(imageString => setImageData(imageString));
  }, []);

  useEffect(() => {
    upload(
      uuid,
      file,
      percentage => {
        setPercentage(percentage);
      },
      imageURL => {
        addProjectImage(projectId, {
          name: file.name,
          url: imageURL,
        }).then(doc => {
          onComplete(doc);
          setImageId(doc.id);
        });
      }
    );
  }, []);

  function openImageDetail(e, imageId) {
    if (!imageId) return;
    e.stopPropagation();
    if (e.nativeEvent.which === 1) {
      history.push(`/images/${imageId}`);
    } else if (e.nativeEvent.which === 3) {
      e.nativeEvent.preventDefault();
      setClickRight(true);
    }
  }

  function shareLink() {
    var textField = document.createElement('textarea');
    textField.innerText = `${window.location.origin}/images/${imageId}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }
  function openDeleteImage() {
    history.push(`/images/${imageId}/delete-image`);
  }

  return (
    <div>
      {clickRight ? (
        <div className="ProjectListItemUpload">
          <div
            className="ProjectListItemUpload-Preview"
            style={{
              backgroundColor: '#ccc',
              backgroundImage: `url(${imageData})`,
              opacity: imageId ? '1' : '0.4',
            }}
          >
            <div
              className="context-menu"
              onMouseLeave={() => setClickRight(false)}
            >
              <div className="image-name-context">
                {file.name.split('.')[0]}
              </div>
              <div onClick={shareLink} className="menu-text">
                Share Link
              </div>
              {isCollab || isOwner ? (
                <div onClick={openDeleteImage} className="menu-text">
                  Delete
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="ProjectListItemUpload"
          onClick={e => openImageDetail(e, imageId)}
          onContextMenu={e => openImageDetail(e, imageId)}
        >
          <div
            className="ProjectListItemUpload-Preview"
            style={{
              backgroundColor: '#ccc',
              backgroundImage: `url(${imageData})`,
              opacity: imageId ? '1' : '0.4',
            }}
          />
          <div
            className="image-name"
            style={{
              backgroundColor: imageId ? '#ffffff' : '#555555',
            }}
          >
            {!imageId && <ProgressIndicator percentage={percentage} />}
            <div
              className="file-name"
              style={{
                color: imageId ? '#000000' : '#d0d0d0',
                lineHeight: imageId ? '3' : '1',
              }}
            >
              {file.name.split('.')[0]}
            </div>
            {!imageId && (
              <div className="uploading-text">
                Uploading {Math.round(percentage)}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectListItemUpload;
