import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import Main from '../Components/Main';
import Loading from '../Components/Loading';
import Post from '../Components/Post';

async function loadPosts(dateOfLastPost) {
  const query = dateOfLastPost ? `?fecha=${dateOfLastPost}` : '';
  const { data: newPosts } = await Axios.get(`/api/posts/feed${query}`);
  return newPosts;
}

const POSTS_PER_CALL = 3;

export default function Feed({ showError, user }) {
  const [posts, setPosts] = useState([]);
  const [loadingInitialPosts, setLoadingInitialPosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

  // Se ejecuta cuando el componente se renderiza por primera vez
  useEffect(() => {
    async function loadInitialPosts() {
      try {
        const newPosts = await loadPosts();
        setPosts(newPosts);
        console.log(newPosts);
        setLoadingInitialPosts(false);
        checkMorePosts(newPosts);
      } catch (error) {
        showError('Hubo un problema cargando tu feed');
        console.log(error);
      }
    }

    loadInitialPosts();
  }, []); // array vacio para que se ejecute una sola vez

  function updatePost(originalPost, updatedPost) {
    setPosts(posts => {
      const updatedPosts = posts.map(post => {
        if (post !== originalPost) {
          return post;
        }
        return updatedPost;
      });

      return updatedPosts;
    });
  }

  async function loadMorePosts() {
    if (loadingMorePosts) {
      return;
    }

    try {
      setLoadingMorePosts(true);
      const dateOfLastPost = posts[posts.length - 1].fecha_creado;
      const newPosts = await loadPosts(dateOfLastPost);
      setPosts(oldPosts => [...oldPosts, ...newPosts]);
      setLoadingMorePosts(false);
      checkMorePosts(newPosts);
    } catch (error) {
      setLoadingMorePosts(false);
      showError('Hubo un problema cargando los siguientes posts.')
    }
  }

  function checkMorePosts(newPosts) {
    if (newPosts.length < POSTS_PER_CALL) {
      setAllPostsLoaded(true);
    }
  }

  if (loadingInitialPosts) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (!loadingInitialPosts && posts.length === 0) {
    return (
      <Main center>
        <YouDontFollowAnyone />
      </Main>
    );
  }

  return (
    <Main center>
      <div className="Feed">
        {posts.map(post => (
          <Post
            key={post._id}
            post={post}
            updatePost={updatePost}
            showError={showError}
            user={user}
          />
        ))}
        <LoadMorePosts onClick={loadMorePosts} allPostsLoaded={allPostsLoaded}/>
      </div>
    </Main>
  );
}

function YouDontFollowAnyone() {
  return (
    <div className="NoSiguesANadie">
      <p className="NoSiguesANadie__mensaje">
        Tu feed no tiene fotos porque no sigues a nadie, o porque no han publicado fotos.
      </p>
      <div className="text-center">
        <Link to="/explore" className="NoSiguesANadie__boton">
          Explora Clontagram
        </Link>
      </div>
    </div>
  );
}

function LoadMorePosts({ onClick, allPostsLoaded }) {
  if (allPostsLoaded) {
    return <div className="Feed__no-hay-mas-posts">No hay más posts</div>;
  }

  return (
    <button className="Feed__cargar-mas" onClick={onClick}>
      Ver más
    </button>
  );
}
