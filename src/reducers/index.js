import { combineReducers } from 'redux';
import { songs, isFetching, errorMessage } from './songs';
import visibilityFilter from './visibilityFilter';
import * as fromSongs from './songs';

const voornameninliedjesApp = combineReducers({
  songs,
  visibilityFilter,
  isFetching,
  errorMessage
});

export default voornameninliedjesApp;

export const getIsFetching = (state) => {
  return fromSongs.getIsFetching(state)
}

export const getSongs = (state) => {
  const my_object = fromSongs.getSongs(state);
  // const sliced = my_object.slice(100, 120);

  // return sliced;
  return my_object;
}

export const getErrorMessage = (state) => {
  return fromSongs.getErrorMessage(state);
}