import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './SongsPage.css';
import MaterialButton from '../material-coponents/MaterialButton';
import { withStyles } from '@material-ui/styles';
import MaterialPaper from '../material-coponents/MaterialPaper';

const styles = theme => ({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 1,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        width: 100,
        padding: '0 30px',
    },
});

class SongsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            filter: 'SHOW'
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        songService.getDone().then(songs => this.setState({ songs }));
    }

    handleClick(status) {
        this.setState({ filter: status })
    }

    render() {
        const { songs } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="h3" gutterBottom>Nummers</Typography>
                <Button onClick={(e) => this.handleClick('SHOW')} disabled={this.state.filter === 'SHOW'} variant="contained" color="primary">
                    Actieve nummers
                </Button>
                <Button onClick={(e) => this.handleClick('IN_PROGRESS')} disabled={this.state.filter === 'IN_PROGRESS'} variant="contained" color="primary">
                    Nummers in bewerking
                </Button>
                <Button onClick={(e) => this.handleClick('TO_BE_DELETED')} disabled={this.state.filter === 'TO_BE_DELETED'} variant="contained" color="primary">
                    Nummers te verwijderen
                </Button>
                <Link to={'/songs/new'}>
                    <Button variant="contained" color="secondary">
                        Nieuw nummer invoeren
                </Button>
                    <MaterialButton />
                </Link>
                {songs.length > 0 &&
                    <div>
                        {songs.filter(song => song.status === this.state.filter).map((song, index) =>
                            <Link key={song.id} to={'/songs/' + song.id}>
                                <MaterialPaper />
                                <Paper className={classes.root}>
                                    <Typography variant="h5" component="h3">
                                        {song.artist}
                                    </Typography>
                                    <Typography component="p">
                                        {song.title}
                                    </Typography>
                                </Paper>
                            </Link>
                        )}
                    </div>
                }
            </div>
        );
    }
}

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);

// SongsPage.propTypes = {
//     classes: PropTypes.object.isRequired,
//   };

// export default withStyles(styles)(SongsPage);
// export { SongsPage };