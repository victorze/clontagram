import Axios from 'axios';

export async function toggleLike(post) {
  const url = `/api/posts/${post._id}/likes`;
  let postWithLikeUpdated;

  if (post.estaLike) {
    await Axios.delete(url, {});
    postWithLikeUpdated = {
      ...post,
      estaLike: false,
      numLikes: post.numLikes - 1
    }
  } else {
    await Axios.post(url, {});
    postWithLikeUpdated = {
      ...post,
      estaLike: true,
      numLikes: post.numLikes + 1
    }
  }

  return postWithLikeUpdated;
}

export async function comment(post, message, user) {
  const { data: newComment } = await Axios.post(
    `/api/posts/${post._id}/comentarios`,
    { mensaje: message }
  );

  newComment.usuario = user;

  const postWithUpdatedComments = {
    ...post,
    comentarios: [...post.comentarios, newComment],
    numComentarios: post.numComentarios + 1
  };

  return postWithUpdatedComments;
}
