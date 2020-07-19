import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addTodo, fetchSongs } from '../actions';
import { getIsFetching, getSongs, getErrorMessage } from '../reducers';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      // margin: theme.spacing(1),
    },
  },
});

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

  handleFilter = (value) => {
    console.log('filter value', value);
  }

  render() {
    const { isFetching, songs, errorMessage, classes } = this.props;

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
        <div className={classes.root}>
          <ButtonGroup size="large" variant="contained" color="primary" aria-label="outlined primary button group">
            <Button onClick={() => this.handleFilter('A')}>A</Button>
            <Button onClick={() => this.handleFilter('B')}>B</Button>
            <Button onClick={() => this.handleFilter('C')}>C</Button>
            <Button onClick={() => this.handleFilter('D')}>D</Button>
            <Button onClick={() => this.handleFilter('E')}>E</Button>
            <Button onClick={() => this.handleFilter('F')}>F</Button>
            <Button onClick={() => this.handleFilter('G')}>G</Button>
            <Button onClick={() => this.handleFilter('H')}>H</Button>
            <Button onClick={() => this.handleFilter('I')}>I</Button>
            <Button onClick={() => this.handleFilter('J')}>J</Button>
            <Button onClick={() => this.handleFilter('K')}>K</Button>
            <Button onClick={() => this.handleFilter('L')}>L</Button>
            <Button onClick={() => this.handleFilter('M')}>M</Button>
          </ButtonGroup>
          <ButtonGroup size="large" variant="contained" color="secondary" aria-label="contained primary button group">
            <Button onClick={() => this.handleFilter('N')}>N</Button>
            <Button onClick={() => this.handleFilter('O')}>O</Button>
            <Button onClick={() => this.handleFilter('P')}>P</Button>
            <Button onClick={() => this.handleFilter('Q')}>Q</Button>
            <Button onClick={() => this.handleFilter('R')}>R</Button>
            <Button onClick={() => this.handleFilter('S')}>S</Button>
            <Button onClick={() => this.handleFilter('T')}>T</Button>
            <Button onClick={() => this.handleFilter('U')}>U</Button>
            <Button onClick={() => this.handleFilter('V')}>V</Button>
            <Button onClick={() => this.handleFilter('W')}>W</Button>
            <Button onClick={() => this.handleFilter('X')}>X</Button>
            <Button onClick={() => this.handleFilter('Y')}>Y</Button>
            <Button onClick={() => this.handleFilter('Z')}>Z</Button>
          </ButtonGroup>
        </div>
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
  errorMessage: PropTypes.string,
  //   todos: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchSongs: PropTypes.func.isRequired,
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

export default withStyles(styles)(SongList2);
