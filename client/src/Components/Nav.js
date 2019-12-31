import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';

export default function Nav({ user }) {
  return (
    <nav className="Nav">
      <ul className="Nav__links">
        <li>
          <Link to="/" className="Nav__link">
            Clontagram
          </Link>
        </li>
        {user && <LoginRoutes />}
      </ul>
    </nav>
  );
}

function LoginRoutes() {
  return (
    <>
      <li className="Nav__link-push">
        <Link className="Nav__link" to="/upload">
          <FontAwesomeIcon icon={faCameraRetro}></FontAwesomeIcon>
        </Link>
      </li>
      <li className="Nav__link-margin-left">
        <Link className="Nav__link" to="/explore">
          <FontAwesomeIcon icon={faCompass}></FontAwesomeIcon>
        </Link>
      </li>
    </>
  )
}
