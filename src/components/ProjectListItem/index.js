import React, { useState } from 'react';
import history from '../history';
import './ProjectListItem.scss';

function ProjectListItem({ image, project, isCollab, isOwner }) {
  const [clickRight, setClickRight] = useState(false);
  console.log(project, 'projectlll');
  function openImageDetail(e) {
    e.stopPropagation();
    if (e.nativeEvent.which === 1) {
      history.push(`/images/${image.id}`);
    } else if (e.nativeEvent.which === 3) {
      e.nativeEvent.preventDefault();
      setClickRight(true);
    }
  }

  function shareLink() {
    var textField = document.createElement('textarea');
    textField.innerText = `${window.location.origin}/images/${image.id}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }
  function openDeleteImage() {
    history.push(`/images/${image.id}/delete-image`);
  }

  return (
    <div>
      {clickRight ? (
        <div className="ProjectListItemUpload">
          <div
            className="context-menu"
            onMouseLeave={() => setClickRight(false)}
          >
            <div className="image-name-context">{image.name}</div>
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
      ) : (
        <div
          className="ProjectListItemUpload"
          onClick={e => openImageDetail(e)}
          onContextMenu={e => openImageDetail(e)}
        >
          <div
            className="ProjectListItemUpload-Preview"
            style={{ backgroundImage: `url('${image.url}')` }}
          />
          <div className="image-name-uploaded">{image.name.split('.')[0]}</div>
        </div>
      )}
    </div>
  );
}

export default ProjectListItem;
