import React, { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    window.firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        // ...
      });
  }
  return (
    <div className="signup-container">
      <form className="signup" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          onChange={e => handleChangeEmail(e)}
          value={email}
        />
        <input
          type="password"
          placeholder="password"
          onChange={e => handleChangePassword(e)}
          value={password}
        />
        <button className="lets-go">submit</button>
      </form>
    </div>
  );
}

export default SignUp;
