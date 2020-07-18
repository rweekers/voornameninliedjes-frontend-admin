import { normalize } from 'normalizr';
import * as schema from './schema';
import { getIsFetching } from '../reducers';
import { songService } from '../services/song.service';

export const fetchSongs = () => (dispatch, getState) => {
  if (getIsFetching(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_SONGS_REQUEST'
  });

  return songService.getAll().then(
    response => {
      console.log('gotten response ', response);
      dispatch({
        type: 'FETCH_SONGS_SUCCESS',
        response: normalize(response, schema.songs)
      });
    },
    error => {
      console.log('gotten error ', error);
      dispatch({
        type: 'FETCH_SONGS_FAILURE',
        message: error.message || 'Something went wrong.',
      });
    }
  );
}

let nextTodoId = 0
export const addTodo = content => ({
  type: 'ADD_TODO',
  payload: {
    id: ++nextTodoId,
    content
  }
})