import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${
        type === 'data'
          ? 'http://127.0.0.1:8000/api/v1/users/updateMe'
          : 'http://127.0.0.1:8000/api/v1/users/updatePassword'
      }`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type[0].toUpperCase()}${type.slice(1)} updated successfully`
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
