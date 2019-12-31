import React from 'react';
import { Link } from 'react-router-dom';
import stringToColor from 'string-to-color';

export default function Avatar({ user }) {
  return (
    <div className="Avatar">
      <ImageAvatar user={user} />
      <Link to={`/perfil/${user.username}`}>
        <h2>{user.username}</h2>
      </Link>
    </div>
  );
}

export function ImageAvatar({ user }) {
  const style = {
    backgroundImagen: user.image ? `url(${user.image})` : null,
    backgroundColor: stringToColor(user.username)
  }

  return <div className="Avatar__img" style={style}></div>;
}
