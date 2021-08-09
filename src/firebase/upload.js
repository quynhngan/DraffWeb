export default (uuid, file, onProgress, onComplete) => {
  var storageRef = window.firebase.storage().ref();
  var uploadTask = storageRef.child(`images/${uuid}${file.name}`).put(file);

  uploadTask.on(
    'state_changed',
    function(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      onProgress(percentage);
    },

    function(error) {},

    function() {
      uploadTask.snapshot.ref.getDownloadURL().then(urlImage => {
        onComplete(urlImage);
      });
    }
  );
};
