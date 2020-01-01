import Axios from 'axios';

export default async function toggleFollowing(user) {
  let updatedUser;

  if (user.siguiendo) {
    await Axios.delete(`/api/amistades/${user._id}/eliminar`);
    updatedUser = {
      ...user,
      numSeguidores: user.numSeguidores - 1,
      siguiendo: false
    }
  } else {
    await Axios.post(`/api/amistades/${user._id}/seguir`);
    updatedUser = {
      ...user,
      numSeguidores: user.numSeguidores + 1,
      siguiendo: true
    }
  }

  return updatedUser;
}

