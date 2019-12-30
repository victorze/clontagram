import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Axios from 'axios';

import { setToken, deleteToken, getToken, initAxiosInterceptors} from './Helpers/auth-helpers';
import Nav from './Components/Nav';

import Signup from './Views/Signup';
import Login from './Views/Login';
import Loading from './Components/Loading';
import Main from './Components/Main';

initAxiosInterceptors();

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
      <Nav />
      {user ? (
        <LoginRoutes />
      ) : (
        <LogoutRoutes login={login} signup={signup} />
      )}
    </Router>
  );
}

function LoginRoutes() {
  return (
    <Switch>
      <Route
        path="/"
        component={() => <Main center><h1>Soy el feed</h1></Main>}
        default
      />
    </Switch>
  )
}

function LogoutRoutes({ login, signup }) {
  return (
    <Switch>
      <Route
        path="/login/"
        render={props => <Login {...props} login={login} />}
      />
      <Route
        render={props => <Signup {...props} signup={signup} />}
        default
      />
    </Switch>
  )
}
