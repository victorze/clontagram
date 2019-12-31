import React, { useState, useEffect } from 'react';
import Main from '../Components/Main';
import Loading from '../Components/Loading';
import Avatar from '../Components/Avatar';
import Comment from '../Components/Comment';
import ButtonLike from '../Components/ButtonLike';
import ResourceNotExist from '../Components/ResourceNotExist';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import  { toggleLike, comment } from '../Helpers/post-helpers';

export default function PostVista({ showError, match, user }) {
  const postId = match.params.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postNotExist, setPostNotExist] = useState(false);
  const [sendingLike, setSendingLike] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data: post } = await Axios.get(`/api/posts/${postId}`);
        setPost(post);
        setLoading(false);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 400)) {
          setPostNotExist(true);
        } else {
          showError('Hubo un problema cargando este post.');
        }
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]); // ejecuta la función de nuevo en caso de que el postId cambie

  async function onSubmitComment(message) {
    const updatedPost = await comment(post, message, user);
    setPost(updatedPost);
  }

  async function onSubmitLike() {
    if (sendingLike) {
      return;
    }

    try {
      setSendingLike(true);
      const updatedPost = await toggleLike(post);
      setPost(updatedPost);
      setSendingLike(false);
    } catch (error) {
      setSendingLike(false);
      showError('Hubo un problema modificando el like. Intenta de nuevo');
      console.log(error);
    }
  }

  if (loading) {
    return (
      <Main center>
        <Loading />;
      </Main>
    );
  }

  if (postNotExist) {
    return (
      <ResourceNotExist
        message="El post que estas intentando ver no existe"
      />
    );
  }

  if (post === null) {
    return null;
  }

  return (
    <Main center>
      <Post
        {...post}
        onSubmitComment={onSubmitComment}
        onSubmitLike={onSubmitLike}
      />
    </Main>
  );
}

function Post({
  comentarios,
  caption,
  url,
  usuario,
  estaLike,
  onSubmitLike,
  onSubmitComment
}) {
  return (
    <div className="Post">
      <div className="Post__image-container">
        <img src={url} alt={caption} />
      </div>
      <div className="Post__side-bar">
        <Avatar user={usuario} />

        <div className="Post__comentarios-y-like">
          <Comments user={usuario} caption={caption} comments={comentarios} />
          <div className="Post__like">
            <ButtonLike onSubmitLike={onSubmitLike} like={estaLike} />
          </div>
          <Comment onSubmitComment={onSubmitComment} />
        </div>
      </div>
    </div>
  );
}

function Comments({ user, caption, comments }) {
  return (
    <ul className="Post__comentarios">
      <li className="Post__comentario">
        <Link
          to={`/perfil/${user.username}`}
          className="Post__autor-comentario"
        >
          <b>{user.username}</b>
        </Link>{' '}
        {caption}
      </li>
      {comments.map(comment => {
        return (
          <li className="Post__comentario" key={comment._id}>
            <Link
              to={`/perfil/${comment.usuario.username}`}
              className="Post__autor-comentario"
            >
              <b>{comment.usuario.username}</b>
            </Link>{' '}
            {comment.mensaje}
          </li>
        )
      })}
    </ul>
  );
}
