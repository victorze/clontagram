import React, {useState} from 'react';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import Loading from '../Components/Loading';
import Main from '../Components/Main';

export default function Upload({ history, showError }) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingPost, setSendingPost] = useState(false);
  const [caption, setCaption] = useState('');

  async function handleSelectedImage(event) {
    try {
      setUploadingImage(true);
      const file = event.target.files[0];

      const config = {
        headers: {
          'Content-Type': file.type
        }
      }

      const { data } = await Axios.post('/api/posts/upload', file, config);
      console.log(data);
      setImageUrl(data.url);
      setUploadingImage(false);
    } catch (error) {
      setUploadingImage(false);
      showError(error.response.data);
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (sendingPost) {
      return;
    }

    if (uploadingImage) {
      showError('No se ha terminado de subir la imagen');
      return;
    }

    if (!imageUrl) {
      showError('Primero selecciona una imagen');
      return;
    }

    try {
      setSendingPost(true);
      const body = {
        caption,
        url: imageUrl
      };
      await Axios.post('/api/posts', body);
      setSendingPost(false);
      history.push('/');
    } catch(error) {
      showError(error.response.data);
    }
  }

  return (
    <Main center>
      <div className="Upload">
        <form onSubmit={handleSubmit}>
          <div className="Upload__image-section">
            <SectionUploadImage
              imageUrl={imageUrl}
              uploadingImage={uploadingImage}
              handleSelectedImage={handleSelectedImage}
            >
            </SectionUploadImage>
          </div>
          <textarea
            name="caption"
            className="Upload__caption"
            maxLength="180"
            placeholder="Caption de tu post."
            value={caption}
            onChange={e => setCaption(e.target.value)}
            required
          />
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  )
}

function SectionUploadImage({ uploadingImage, imageUrl, handleSelectedImage }) {
  if (uploadingImage) {
    return <Loading />;
  } else if (imageUrl) {
    return <img src={imageUrl} alt="" />;
  } else {
    return (
      <label className="Upload__image-label">
        <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
        <span>Publica una foto</span>
        <input
          type="file"
          className="hidden"
          name="imagen"
          onChange={handleSelectedImage}
        />
      </label>
    )
  }
}
