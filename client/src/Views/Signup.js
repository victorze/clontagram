import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Main from '../Components/Main';
import imageSignup from '../images/signup.png';

export default function Signup({ signup, showError }) {
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    bio: '',
    nombre: '',
  });

  function handleInputChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await signup(user);
    } catch (error) {
      showError(error.response.data);
      console.log(error)
    }
  }

  return (
    <Main center={true}>
      <div className="Signup">
        <img className="Signup__img" src={imageSignup} alt="" />
        <div className="FormContainer">
          <h1 className="Form__titulo">Clontagram</h1>
          <p className="FormContainer__info">
            Regístrate para que veas el clon de Instagram
          </p>
          <form onSubmit={handleSubmit}>
            <input
              className="Form__field"
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
              value={user.email}
            />
            <input
              className="Form__field"
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              minLength="3"
              maxLength="100"
              required
              onChange={handleInputChange}
              value={user.nombre}
            />
            <input
              className="Form__field"
              type="text"
              name="username"
              placeholder="Username"
              minLength="3"
              maxLength="30"
              required
              onChange={handleInputChange}
              value={user.username}
            />
            <input
              className="Form__field"
              type="text"
              name="bio"
              placeholder="Cuéntanos de tí"
              maxLength="150"
              required
              onChange={handleInputChange}
              value={user.bio}
            />
            <input
              className="Form__field"
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              onChange={handleInputChange}
              value={user.password}
            />
            <button className="Form__submit" type="submit">Sign up</button>
            <p className="FormContainer__info">
              ¿Ya tienes cuenta? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Main>
  );
}
