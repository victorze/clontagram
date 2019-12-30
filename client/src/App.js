import React from 'react';
import Nav from './Components/Nav';

import Signup from './Views/Signup';
import Login from './Views/Login';

export default function App() {
  return (
    <div className="ContenedorTemporal">
      <Nav />
      {/* <Signup /> */}
      <Login />
    </div>
  );
}
