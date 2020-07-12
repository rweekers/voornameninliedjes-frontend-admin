// const song = (state, action) => {
//     // TODO Add switch statement
//     return state;
//   };
  
  export const songs = (state = [], action) => {
    // TODO Add switch statement
    return state;
  };
  
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
