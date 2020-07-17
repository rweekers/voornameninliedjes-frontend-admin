// const song = (state, action) => {
//     // TODO Add switch statement
//     return state;
//   };

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return true;
    case 'FETCH_TODOS_SUCCESS':
    case 'FETCH_TODOS_FAILURE':
      return false;
    default:
      return state;
  }
};

export const songs = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SONGS_SUCCESS':
      console.log('Result: ', action);
      return action.response.entities.songs.undefined // check why this undefined is there
      // return state
    default:
      return state
  }
}

