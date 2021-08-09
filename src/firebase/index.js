export const addProjectImage = (projectId, image) => {
  return window.firebase
    .firestore()
    .collection('images')
    .add({
      ...image,
      projectId,
      createdAt: window.firebase.firestore.Timestamp.now(),
      description: '',
    });
};
