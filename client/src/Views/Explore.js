import React, { useState, useEffect } from 'react';
import { Link }from 'react-router-dom';
import Loading from '../Components/Loading';
import { ImageAvatar } from '../Components/Avatar';
import Axios from 'axios';
import Main from '../Components/Main';
import Grid from '../Components/Grid';

export default function Explore({ showError }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostsAndUsers() {
      try {
        const [posts, users] = await Promise.all([
          Axios.get('/api/posts/explore').then(({ data }) => data),
          Axios.get('/api/usuarios/explore').then(({ data }) => data)
        ]);
        setPosts(posts);
        setUsers(users);
        setLoading(false);
      } catch (error) {
        showError('Hubo un problema cargando explore. Por favor refresca la página');
        console.log(error);
      }
    }

    loadPostsAndUsers();
  }, []);

  if (loading) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  return (
    <Main>
      <div className="Explore__section">
        <h2 className="Explore__title">
          Descubrir usuarios
        </h2>
        <div className="Explore__usuarios-container">
          {users.map(user => {
            return (
              <div className="Explore__usuario" key={user.id}>
                <ImageAvatar user={user} />
                <p>{user.username}</p>
                <Link to={`/perfil/${user.username}`}>
                  Ver perfil
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <div className="Explore__section">
        <h2 className="Explore__title">Explorar</h2>
        <Grid posts={posts} />
      </div>
    </Main>
  )
}
