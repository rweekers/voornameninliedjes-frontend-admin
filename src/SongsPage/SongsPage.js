import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import SongsList from '../SongsList/SongsList';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './SongsPage.css';
import { withStyles } from '@material-ui/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

const SONGS_TO_SHOW = "SHOW";
const SONGS_IN_PROGRESS = "IN_PROGRESS";
const SONGS_TO_BE_DELETED = "TO_BE_DELETED";

const InitialState = {
    songs: [],
    songsToShow: [],
    songsInProgress: [],
    songsToBeDeleted: [],
    filter: []
}

class SongsPage extends React.Component {
    constructor(props) {
        super(props);

        // Retrieve the last state
        this.state = localStorage.getItem("appState") ? JSON.parse(localStorage.getItem("appState")) : InitialState;

        songService.getDone().then(songs => {
            const songsToShow = songs.filter(song => SONGS_TO_SHOW.includes(song.status));
            const songsInProgress = songs.filter(song => SONGS_IN_PROGRESS.includes(song.status));
            const songsToBeDeleted = songs.filter(song => SONGS_TO_BE_DELETED.includes(song.status));

            this.setState({
                'songsToShow': songsToShow,
                'songsInProgress': songsInProgress,
                'songsToBeDeleted': songsToBeDeleted
            })
        });
    }

    componentDidMount() {
        this.setState({ 'filter': SONGS_TO_SHOW });
    }

    componentWillUnmount() {
        // Remember state for the next mount
        localStorage.setItem('appState', JSON.stringify(this.state));
    }

    handleChange = name => event => {
        const filterValue = event.target.value;
        this.setState({ filter: filterValue });
    };

    render() {
        const { songsToShow, songsInProgress, songsToBeDeleted } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Nummers</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div id="switchesWrapper">
                            <RadioGroup id="switches">
                                <FormControlLabel
                                    control={
                                        <Radio checked={this.state.filter === SONGS_TO_SHOW} onChange={this.handleChange(SONGS_TO_SHOW)} value={SONGS_TO_SHOW} color="primary" />
                                    }
                                    label="Actieve nummers"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Radio checked={this.state.filter === SONGS_IN_PROGRESS} onChange={this.handleChange(SONGS_IN_PROGRESS)} value={SONGS_IN_PROGRESS} color="primary" />
                                    }
                                    label="Nummers in bewerking"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Radio checked={this.state.filter === SONGS_TO_BE_DELETED} onChange={this.handleChange(SONGS_TO_BE_DELETED)} value={SONGS_TO_BE_DELETED} color="primary" />
                                    }
                                    label="Nummers te verwijderen"
                                    labelPlacement="start"
                                />
                            </RadioGroup>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Link key='new' to={'/songs/new'}>
                            <Button id="newSong" variant="contained" color="primary">
                                Nieuw nummer invoeren
                                </Button>
                        </Link>
                    </Grid>
                </Grid>
                {this.state.filter === 'SHOW' &&
                    <SongsList songs={songsToShow} />
                }
                {this.state.filter === 'IN_PROGRESS' &&
                    <SongsList songs={songsInProgress} />
                }
                {this.state.filter === 'TO_BE_DELETED' &&
                    <SongsList songs={songsToBeDeleted} />
                }
            </div>
        )
    }
}

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);