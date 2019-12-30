import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../Components/Main';

export default function Login({ login, showError }) {
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
      await login(emailAndPassword.email, emailAndPassword.password)
    } catch (error) {
      showError(error.response.data);
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
              ¿No tienes cuenta? <Link to="/signup">Signup</Link>
            </p>
          </form>
      </div>
    </div>
  </Main>
  )
}
