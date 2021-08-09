import React, { useState, useEffect, useLayoutEffect } from 'react';
import Login from '../Login';
import Register from '../Register';
import cancel from '../../assets/cancel.png';
import './annotation.css';

function Annotation({ annotation, imageId, onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [textareaHeight, setTextareaHeight] = useState(60);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [email, setEmail] = useState('');
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  function openGetStarted() {
    setOpenOverlay(false);
    setOpenRegister(true);
    setOpenLogin(false);
  }
  function openLoginPage() {
    setOpenLogin(true);
    setOpenRegister(false);
    setOpenOverlay(false);
  }
  function closeOverlay() {
    setOpenLogin(false);
    setOpenRegister(false);
    setOpenOverlay(false);
  }

  function closeOverlayLeaveComment() {
    setOpenOverlay(false);
  }

  useEffect(() => {
    if (annotation.id === window.currentAnnotationId && !visible) {
      delete window.currentAnnotationId;
      setVisible(true);
    }
  });

  function handleAnnotationHover() {
    if (visible) return;
    setVisible(true);
  }

  function handleKeyUp(e) {
    setTextareaHeight(e.target.scrollHeight);
  }

  function handleChange(e) {
    setComment(e.target.value);
  }

  function hideAnnotation() {
    setVisible(false);
  }

  useLayoutEffect(() => {
    if (!annotation.id) return;
    window.addEventListener('hideAllAnnotation', hideAnnotation);

    return () => {
      window.removeEventListener('hideAllAnnotation', hideAnnotation);
    };
  });
  async function handleSubmit(e) {
    e && e.preventDefault();
    if (localStorage.getItem('email') === null) {
      setOpenOverlay(true);
    } else {
      const addOrUpdate = annotation.id
        ? window.firebase
            .firestore()
            .collection('annotations')
            .doc(annotation.id)
            .set(
              {
                comments: [
                  ...annotation.comments,
                  {
                    message: comment,
                    user: {
                      name: localStorage.getItem('userName')
                        ? localStorage.getItem('userName')
                        : localStorage.getItem('email'),
                    },
                  },
                ],
              },
              { merge: true }
            )
        : window.firebase
            .firestore()
            .collection('annotations')
            .add({
              imageId,
              top: annotation.top,
              left: annotation.left,
              comments: [
                {
                  message: comment,
                  user: {
                    name: localStorage.getItem('userName')
                      ? localStorage.getItem('userName')
                      : localStorage.getItem('email'),
                  },
                },
              ],
            })
            .then(function(doc) {
              window.currentAnnotationId = doc.id;
            });

      addOrUpdate.then(function() {
        onSubmit && onSubmit();
        setComment('');
        setOpenOverlay(false);
        document.getElementById('comment-textarea').focus();
      });
    }
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
    localStorage.setItem('email', e.target.value);
  }
  function handleMouseEnter(e) {
    e.stopPropagation();
    document.getElementById('comment-textarea').focus();
  }
  return (
    <div
      className="comment-position"
      style={{ top: `${annotation.top}px`, left: `${annotation.left}px` }}
      onClick={e => e.stopPropagation()}
    >
      <i className="marker" onMouseEnter={handleAnnotationHover}>
        <i className="marker-inner" />
      </i>
      {visible && (
        <div className="balloon" onMouseEnter={e => handleMouseEnter(e)}>
          <article>
            <form onSubmit={handleSubmit}>
              {annotation.comments.map(comment => (
                <div>
                  <div className="comment-text">{comment.message}</div>
                  {comment.user.name ? (
                    <div className="user-text">-{comment.user.name}</div>
                  ) : (
                    <div className="user-text">
                      -{localStorage.getItem('email')}
                    </div>
                  )}
                </div>
              ))}
              <div className="textarea-container">
                <div className="beautifier">
                  <div className="content">
                    <span className="regular">­</span>
                  </div>
                </div>
                <textarea
                  id="comment-textarea"
                  placeholder="Write comment..."
                  className="comment-textarea"
                  style={{ height: `${textareaHeight}px` }}
                  onKeyUp={e => handleKeyUp(e)}
                  onChange={e => handleChange(e)}
                  value={comment}
                />
              </div>
              <button
                type="submit"
                className="post-button"
                style={{ display: comment.length !== 0 ? 'block' : 'none' }}
              >
                Post this comment
              </button>
            </form>
          </article>
        </div>
      )}
      <div
        className="unauth-wrapper"
        style={{ display: openOverlay ? 'block' : 'none' }}
      >
        <div className="button-cancel" onClick={closeOverlayLeaveComment}>
          <img className="cancel-btn" src={cancel} alt="cancel" />
        </div>
        <div className="title-text-create">
          Thanks for the comment! <br />{' '}
          <span className="title-text-create-small">
            Let us know how to reach you when someone replies
          </span>
        </div>
        <form className="password" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-email"
            placeholder="your email"
            onChange={e => handleChangeEmail(e)}
            value={email}
          />

          <button type="submit" className="btn-post">
            SAVE COMMENT
          </button>
          <div className="text-or"> OR </div>
          <button type="button" className="btn-post" onClick={openGetStarted}>
            CREATE AN ACCOUNT
          </button>
        </form>
      </div>
      {openLogin && (
        <Login closeOverlay={closeOverlay} openGetStarted={openGetStarted} />
      )}
      {openRegister && (
        <Register
          onComplete={handleSubmit}
          closeOverlay={closeOverlay}
          openLoginPage={openLoginPage}
        />
      )}
    </div>
  );
}

export default Annotation;
