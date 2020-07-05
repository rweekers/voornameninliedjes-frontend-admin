import { normalize } from 'normalizr';
import * as schema from './schema';
import { getIsFetching } from '../reducers';
import { songService } from '../services/song.service';

export const fetchSongs = (filter) => (dispatch, getState) => {
  if (getIsFetching(getState(), filter)) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_SONGS_REQUEST',
    filter,
  });

  return songService.getAll().then(
    response => {
      dispatch({
        type: 'FETCH_SONGS_SUCCESS',
        filter,
        // response: normalize(response, schema.arrayOfTodos),
        response: []
      });
    },
    error => {
      dispatch({
        type: 'FETCH_SONGS_FAILURE',
        filter,
        message: error.message || 'Something went wrong.',
      });
    }
  );
};