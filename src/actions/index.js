// import { normalize } from 'normalizr';
// import * as schema from './schema';
import { getIsFetching } from '../reducers';
// import { songService } from '../services/song.service';

export const fetchSongs = () => (dispatch, getState) => {
  if (getIsFetching(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_TODOS_REQUEST'
  });
  return Promise.resolve();
}

let nextTodoId = 0
export const addTodo = content => ({
  type: 'ADD_TODO',
  payload: {
    id: ++nextTodoId,
    content
  }
})

// export const fetchSongs = () => {
//     console.log('getting songs');
//     songService.getAll().then(
//           response => {
//             console.log('gotten response ', response);
//             dispatch({
//               type: 'FETCH_SONGS_SUCCESS',
//               filter,
//               // response: normalize(response, schema.arrayOfTodos),
//               response: []
//             });
//           },
//           error => {
//             console.log('gotten error ', error);
//             dispatch({
//               type: 'FETCH_SONGS_FAILURE',
//               filter,
//               message: error.message || 'Something went wrong.',
//             });
//           }
//         );
// }

// export const fetchSongs = (filter) => (dispatch, getState) => {
//   console.log('getting songs');
//   if (getIsFetching(getState(), filter)) {
//     return Promise.resolve();
//   }
//   console.log('requesting songs');
//   dispatch({
//     type: 'FETCH_SONGS_REQUEST',
//     filter,
//   });

//   return songService.getAll().then(
//     response => {
//       console.log('gotten response ', response);
//       dispatch({
//         type: 'FETCH_SONGS_SUCCESS',
//         filter,
//         // response: normalize(response, schema.arrayOfTodos),
//         response: []
//       });
//     },
//     error => {
//       console.log('gotten error ', error);
//       dispatch({
//         type: 'FETCH_SONGS_FAILURE',
//         filter,
//         message: error.message || 'Something went wrong.',
//       });
//     }
//   );
// };