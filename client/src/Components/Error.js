import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

export default function Error({ message, hideError }) {
  if (!message) {
    return null;
  }

  return (
    <div className="ErrorContainer" role="alert">
      <div className="Error__inner">
        <span className="block">{message}</span>
        <button className="Error__button" onClick={hideError}>
          <FontAwesomeIcon className="Error__icon" icon={faTimesCircle} />
        </button>
      </div>
    </div>
  )
}
