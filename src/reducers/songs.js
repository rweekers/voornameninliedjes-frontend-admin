// const song = (state, action) => {
//     // TODO Add switch statement
//     return state;
//   };

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'FETCH_SONGS_REQUEST':
      return true;
    case 'FETCH_SONGS_SUCCESS':
    case 'FETCH_SONGS_FAILURE':
      return false;
    default:
      return state;
  }
};

export const songs = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SONGS_SUCCESS':
      return action.response.result
    default:
      return state
  }
}

export const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_SONGS_FAILURE':
      return action.message;
    case 'FETCH_SONGS_REQUEST':
    case 'FETCH_SONGS_SUCCESS':
      return null;
    default:
      return state;
  }
};

export const getIsFetching = (state) => state.isFetching;
export const getSongs = (state) => state.songs;
export const getErrorMessage = (state) => state.errorMessage;