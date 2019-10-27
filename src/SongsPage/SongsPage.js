import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import SongsList from '../SongsList/SongsList';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './SongsPage.css';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

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
            const songsToShow = songs.filter(song => "SHOW".includes(song.status));
            const songsInProgress = songs.filter(song => "IN_PROGRESS".includes(song.status));
            const songsToBeDeleted = songs.filter(song => "TO_BE_DELETED".includes(song.status));

            this.setState({
                'songsToShow': songsToShow,
                'songsInProgress': songsInProgress,
                'songsToBeDeleted': songsToBeDeleted
            })
        });
    }

    componentDidMount() {
        this.setState({ 'filter': 'SHOW' });
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
                            <FormGroup id="switches">
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filter === 'SHOW'} onChange={this.handleChange('SHOW')} value="SHOW" color="primary" />
                                    }
                                    label="Actieve nummers"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filter === 'IN_PROGRESS'} onChange={this.handleChange('IN_PROGRESS')} value="IN_PROGRESS" color="secondary" />
                                    }
                                    label="Nummers in bewerking"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filter === 'TO_BE_DELETED'} onChange={this.handleChange('TO_BE_DELETED')} value="TO_BE_DELETED" color="secondary" />
                                    }
                                    label="Nummers te verwijderen"
                                    labelPlacement="start"
                                />
                            </FormGroup>
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