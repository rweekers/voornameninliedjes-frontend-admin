import { combineReducers } from 'redux';
import songs from './songs';
import visibilityFilter from './visibilityFilter';

const voornameninliedjesApp = combineReducers({
  songs,
  visibilityFilter,
});

export default voornameninliedjesApp;

export const getIsFetching = (state, filter) =>
''
  // fromList.getIsFetching(state.listByFilter[filter]);