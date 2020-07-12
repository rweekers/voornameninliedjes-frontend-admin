import { combineReducers } from 'redux';
import { songs, isFetching } from './songs';
import visibilityFilter from './visibilityFilter';

const voornameninliedjesApp = combineReducers({
  songs,
  visibilityFilter,
  isFetching
});

export default voornameninliedjesApp;

export const getIsFetching2 = (state, filter) =>
  ''
// fromList.getIsFetching(state.listByFilter[filter]);

export const getIsFetching = (state) => {
  console.log('Gotten state ', state);
  return false;
}