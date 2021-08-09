import React, { useState, useEffect } from 'react';
export const User = React.createContext({});

function UserContext({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    window.firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  return <User.Provider value={currentUser}>{children}</User.Provider>;
}
export default UserContext;
