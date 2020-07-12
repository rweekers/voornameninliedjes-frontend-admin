// import React, { Component, PropTypes } from 'react';
import React from 'react';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
import { addTodo, fetchSongs } from '../actions';
// import { getVisibleTodos, getErrorMessage, getIsFetching } from '../reducers';
// import TodoList from './TodoList';
// import FetchError from './FetchError';

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
    // const { isFetching, errorMessage, toggleTodo, todos } = this.props;
    // if (isFetching && !todos.length) {
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
    isFetching: true
    // isFetching: getIsFetching(state, filter),
    // errorMessage: getErrorMessage(state, filter),
    // todos: getVisibleTodos(state, filter),
    // filter,
  };
};

SongList2 = connect(
  mapStateToProps,
  { addTodo, fetchSongs }
)(SongList2);

export default SongList2;