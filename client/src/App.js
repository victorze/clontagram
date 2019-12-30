import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from 'axios';

import { setToken, deleteToken, getToken, initAxiosInterceptors} from './Helpers/auth-helpers';
import Main from './Components/Main';
import Nav from './Components/Nav';
import Loading from './Components/Loading';
import Error from './Components/Error';

import Signup from './Views/Signup';
import Login from './Views/Login';
import Upload from './Views/Upload';

initAxiosInterceptors();

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  async function login(email, password) {
    const { data } = await Axios.post('/api/usuarios/login', {email, password});
    setUser(data.usuario);
    setToken(data.token);
  }

  // Se llama cada vez que el componente hace render
  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoadingUser(false);
        console.log('no token');
        return;
      }

      try {
        const { data: usuario } = await Axios.get('/api/usuarios/whoami');
        setUser(usuario);
        setLoadingUser(false);
      } catch(error) {
        console.log(error);
      }
    }

    loadUser();
  }, []);

  async function signup(user) {
    const { data } = await Axios.post('/api/usuarios/signup', user);
    setUser(data.usuario);
    setToken(data.token);
    console.log(data);
  }

  function showError(message) {
    setError(message);
  }

  function hideError() {
    setError(null);
  }

  function logout() {
    setUser(null);
    deleteToken();
  }

  if (loadingUser) {
    return (
      <Main center>
        <Loading />
      </Main>
    )
  }

  return (
    <Router>
      <Nav user={user}/>
      <Error message={error} hideError={hideError}/>
      {user ? (
        <LoginRoutes showError={showError}/>
      ) : (
        <LogoutRoutes login={login} signup={signup} showError={showError}/>
      )}
    </Router>
  );
}

function LoginRoutes({ showError }) {
  return (
    <Switch>
      <Route
        path="/upload"
        render={props => <Upload {...props} showError={showError} />}
      />
      <Route
        path="/"
        component={() => <Main center><h1>Soy el feed</h1></Main>}
        default
      />
    </Switch>
  )
}

function LogoutRoutes({ login, signup, showError}) {
  return (
    <Switch>
      <Route
        path="/login/"
        render={props => <Login {...props} login={login} showError={showError} />}
      />
      <Route
        render={props => <Signup {...props} signup={signup} showError={showError} />}
        default
      />
    </Switch>
  )
}
