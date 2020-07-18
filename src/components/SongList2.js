// import React, { Component, PropTypes } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { addTodo, fetchSongs } from '../actions';
import { getIsFetching, getSongs, getErrorMessage } from '../reducers';

class SongList2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  updateInput = input => {
    this.setState({ input });
  };

  componentDidMount() {
    this.props.fetchSongs();
  }

  componentDidUpdate(prevProps) {
    // if (this.props.filter !== prevProps.filter) {
    //   this.fetchData();
    // }
  }

  handleAddTodo = () => {
    // dispatches actions to add todo
    this.props.addTodo(this.state.input)

    // sets state back to empty string
    this.setState({ input: '' })
  }

  render() {
    const { isFetching, songs, errorMessage } = this.props;

    if (isFetching && !songs.length) {
      return <p>Loading...</p>;
    }

    if (errorMessage && !songs.length) {
      return (
        <div>
          <p>{errorMessage}</p>
        </div>
      );
    }

    return (
      <div>
        <p>Check</p>;
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
          </button>
        <ul>
          {songs.map(song =>
            <div key={song.id}>{song.title} - {song.artist}</div>
          )}
        </ul>
      </div>
    )
  }
}

SongList2.propTypes = {
  //   filter: PropTypes.oneOf(['all', 'active', 'completed']).isRequired,
  //   errorMessage: PropTypes.string,
  //   todos: PropTypes.array.isRequired,
  //   isFetching: PropTypes.bool.isRequired,
  //   fetchTodos: PropTypes.func.isRequired,
  //   toggleTodo: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { params }) => {
  //   const filter = params.filter || 'all';
  return {
    isFetching: getIsFetching(state),
    songs: getSongs(state),
    errorMessage: getErrorMessage(state),
  };
};

SongList2 = connect(
  mapStateToProps,
  { addTodo, fetchSongs }
)(SongList2);

export default SongList2;