import React from 'react';
import Main from './Main';
import { Link } from 'react-router-dom';

export default function ResourceNotExit({ message }) {
  return (
    <Main>
      <div>
        <h2 className="RecursoNoExiste__mensaje">{message}</h2>
        <p className="RecursoNoExiste__link-container">
          Ir al <Link to="/">home</Link>
        </p>
      </div>
    </Main>
  );
}
