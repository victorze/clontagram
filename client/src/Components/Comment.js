import React, { useState } from 'react';

export default function Comment({ onSubmitComment, showError }) {
  const [message, setMessage] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (sendingComment) {
      return;
    }

    try {
      setSendingComment(true);
      await onSubmitComment(message);
      setMessage('');
      setSendingComment(false);
    } catch(error) {
      setSendingComment(false);
      showError('Hubo un problema guardando el comentario. Intenta de nuevo');
    }
  }

  return (
    <form className="Post__comentario-form-container" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Deja un comentario..."
        maxLength="180"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button type="submit">Post</button>
    </form>
  );
}
