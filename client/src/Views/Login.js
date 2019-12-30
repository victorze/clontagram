import React, { useState } from 'react';
import Main from '../Components/Main';

export default function Login({ login }) {
  const [emailAndPassword, setEmailAndPassword] = useState({
    email: '',
    password: '',
  });

  function handleInputChange(e) {
    setEmailAndPassword({
      ...emailAndPassword,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      login(emailAndPassword.email, emailAndPassword.password)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Main center>
      <div className="FormContainer">
        <div className="Form__titulo">Clontagram</div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              className="Form__field"
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
              value={emailAndPassword.email}
            />
          <input
            className="Form__field"
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={handleInputChange}
            value={emailAndPassword.password}
          />
          <button type="submit" className="Form__submit">
            Login
          </button>
          <p className="FormContainer__info">
            ¿No tienes cuenta? <a href="/signup">Signup</a>
          </p>
        </form>
      </div>
    </div>
  </Main>
  )
}
