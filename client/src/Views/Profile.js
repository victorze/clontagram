import React, { useState, useEffect } from 'react';
import Main from '../Components/Main';
import Loading from '../Components/Loading';
import Grid from '../Components/Grid';
import ResourceNotExist from '../Components/ResourceNotExist';
import Axios from 'axios';
import stringToColor from 'string-to-color';
import toggleFollowing from '../Helpers/friendship-helpers';
import useItsMobil from '../Hooks/useItsMobil';

export default function Profile({ showError, user, match, logout }) {
  const [profileOwnerUser, setProfileOwnerUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileNotExist, setProfileNotExist] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingFriendship, setSendingFriendship] = useState(false);
  const itsMobil = useItsMobil();

  const username = match.params.username;

  useEffect(() => {
    async function loadPostsAndUser() {
      try {
        setLoadingProfile(true);
        const { data: user } = await Axios.get(`/api/usuarios/${username}`);
        const { data: posts } = await Axios.get(`/api/posts/usuario/${user._id}`);
        setProfileOwnerUser(user);
        setPosts(posts);
        setLoadingProfile(false);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 400)
        ) {
          setProfileNotExist(true);
        } else {
          showError('Hubo un problema cargando este perfil.');
        }

        setLoadingProfile(false);
      }
    }

    loadPostsAndUser();
  }, [username]); // Si username cambia en la url, se ejecuta esta función

  function isProfileOwner() {
    return user._id === profileOwnerUser._id;
  }

  async function handleImageSelected(event) {
    try {
      setUploadingImage(true);
      const file = event.target.files[0];
      const config = {
        headers: {
          'Content-Type': file.type
        }
      }
      const { data } = await Axios.post('/api/usuarios/upload', file, config);
      setProfileOwnerUser({ ...profileOwnerUser, imagen: data.url });
      setUploadingImage(false);
    } catch (error) {
      showError(error.response.data);
      setUploadingImage(false);
      console.log(error);
    }
  }

  async function onToggleFollowing() {
    if (sendingFriendship) {
      return;
    }

    try {
      setSendingFriendship(true);
      const updatedUser = await toggleFollowing(profileOwnerUser);
      setProfileOwnerUser(updatedUser);
      setSendingFriendship(false);
    } catch (error) {
      showError('Hubo un problema siguiendo/dejando de seguir a este usuario. Intenta de nuevo');
      setSendingFriendship(false);
      console.log(error);
    }
  }

  if (loadingProfile) {
    return (
      <Main center>
        <Loading />
      </Main>
    );
  }

  if (profileNotExist) {
    return (
      <ResourceNotExist message="El perfil que estas intentando ver no existe" />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Main>
      <div className="Perfil">
        <ImageAvatar
          isProfileOwner={isProfileOwner()}
          profileOwnerUser={profileOwnerUser}
          handleImageSelected={handleImageSelected}
          uploadingImage={uploadingImage}
        />
        <div className="Perfil__bio-container">
          <div className="Perfil__bio-heading">
            <h2 className="capitalize">{profileOwnerUser.username}</h2>
            {!isProfileOwner() && (
              <FollowButton
                following={profileOwnerUser.siguiendo}
                toggleFollowing={onToggleFollowing}
              />
            )}
            {isProfileOwner() && <LogoutButton logout={logout} />}
          </div>
          {!itsMobil && <DescriptionProfile profileOwnerUser={profileOwnerUser}/>}
        </div>
      </div>
      {itsMobil && <DescriptionProfile profileOwnerUser={profileOwnerUser}/>}

      <div className="Perfil__separador" />
      {posts.length > 0 ? <Grid posts={posts} /> : <NotPostedPhotos />}
    </Main>
  );
}

function DescriptionProfile({ profileOwnerUser }) {
  return (
    <div className="Perfil__description">
      <h2 className="Perfil__nombre">{profileOwnerUser.nombre}</h2>
      <p>{profileOwnerUser.bio}</p>
      <p className="Perfil__estadisticas">
        <b>{profileOwnerUser.numSiguiendo}</b> following
        <span className="ml-4">
          <b>{profileOwnerUser.numSeguidores}</b> followers
        </span>
      </p>
    </div>
  );
}

function ImageAvatar({
  isProfileOwner,
  profileOwnerUser,
  handleImageSelected,
  uploadingImage
}) {
  let content;

  if (uploadingImage) {
    content = <Loading />;
  } else if (isProfileOwner) {
    content = (
      <label
        className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
        style={{
          backgroundImage: profileOwnerUser.imagen
            ? `url(${profileOwnerUser.imagen})`
            : null,
          backgroundColor: stringToColor(profileOwnerUser.username)
        }}
      >
        <input
          type="file"
          onChange={handleImageSelected}
          className="hidden"
          name="image"
        />
      </label>
    )
  } else {
    content = (
      <div
        className="Perfil__img-placeholder"
        style={{
          backgroundImage: profileOwnerUser.imagen
            ? `url(${profileOwnerUser.imagen})`
            : null,
          backgroundColor: stringToColor(profileOwnerUser.username)
        }}
      ></div>
    )
  }

  return <div className="Perfil__img-container">{content}</div>
}

function FollowButton({ following, toggleFollowing }) {
  return (
    <button onClick={toggleFollowing} className="Perfil__boton-seguir">
      {following ? 'Dejar de seguir' : 'Seguir'}
    </button>
  );
}

function LogoutButton({ logout }) {
  return (
    <button
      className="Perfil__boton-logout"
      onClick={logout}
    >
      Logout
    </button>
  )
}

function NotPostedPhotos() {
  return (
    <p class="text-center">Este usuario no ha posteado fotos.</p>
  );
}
