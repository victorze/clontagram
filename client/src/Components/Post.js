import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Avatar from './Avatar';
import ButtonLike from './ButtonLike';
import Comment from './Comment';

import  { toggleLike, comment } from '../Helpers/post-helpers';

export default function Post({ post, updatePost, showError, user}) {
  const {
    numLikes,
    numComentarios,
    comentarios,
    _id,
    caption,
    url,
    usuario: postUser,
    estaLike
  } = post;

  // Para evitar que se hagan varias peticiones al servidor
  const [sendingLike, setSendingLike] = useState(false);

  async function onSubmitLike() {
    if (sendingLike) {
      return;
    }

    try {
      setSendingLike(true);
      const updatedPost = await toggleLike(post);
      updatePost(post, updatedPost);
      setSendingLike(false);
    } catch (error) {
      setSendingLike(false);
      showError('Hubo un problema modificando el like. Intenta de nuevo');
      console.log(error);
    }
  }

  async function onSubmitComment(message) {
    const updatedPost = await comment(post, message, user);
    updatePost(post, updatedPost);
  }

  return (
    <div className="Post-Componente">
      <Avatar user={postUser} />
      <img
        className="Post-Componente__img"
        src={url}
        alt={caption}
      />
      <div className="Post-Componente__acciones">
        <div className="Post-Componente__like-container">
          <ButtonLike onSubmitLike={onSubmitLike} like={estaLike} />
        </div>
        <p>Liked por {numLikes} personas</p>
        <ul>
          <li>
            <Link to={`/perfil/${postUser.username}`}>
              <b>{postUser.username}</b>
            </Link>{' '}
            {caption}
          </li>
          <SeeAllComments _id={_id} numComments={numComentarios} />
          <Comments comments={comentarios} />
        </ul>
      </div>
      <Comment onSubmitComment={onSubmitComment} showError={showError}/>
    </div>
  );
}

function SeeAllComments({ _id, numComments }) {
  if (numComments < 4) {
    return null;
  }

  return (
    <li className="text-grey-dark">
      <Link to={`/post/${_id}`}>
        Ver los {numComments} comentarios
      </Link>
    </li>
  )
}

function Comments({ comments }) {
  if (comments.length === 0) {
    return null;
  }

  return comments.map(comment => {
    return (
      <li key={comment._id}>
        <Link to={`/perfil/${comment.usuario.username}`}>
          <b>{comment.usuario.username}</b>
        </Link>{' '}
        {comment.mensaje}
      </li>
    )
  })
}
