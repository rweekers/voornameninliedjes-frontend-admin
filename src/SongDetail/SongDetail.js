import React from 'react';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import './SongDetail.css';
import { withStyles } from '@material-ui/styles';
import { BehaviorSubject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactMarkdown from 'react-markdown';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: 10,
        marginRight: 10,
    },
    toggleButtons: {
        backgroundColor: "#424242",
        marginLeft: 10,
        marginRight: 10,
    },
    toggleButtonText: {
        color: 'white',
    },
    inputLabel: {
        color: 'lightgrey !important',
        borderWidth: '1px',
        fontSize: 18,
    },
    input: {
        color: 'white',
        fontSize: 18,
    },
    multilineInput: {
        color: 'white',
        fontSize: 18,
        lineHeight: 1.5,
        marginTop: 5,
    },
    underline: {
        '&:before': {
            borderBottomColor: 'lightgrey',
        },
        '&:after': {
            borderBottomColor: 'lightgrey',
        },
        '&:hover:before': {
            borderBottomColor: ['lightgrey', '!important'],
        },
    },
    notchedOutline: {
        borderWidth: "1px",
        borderColor: "lightgrey !important",
    },
    button: {
        margin: 10,
    },
    expansionPanel: {
        color: "lightgrey",
        backgroundColor: "#424242",
        marginLeft: 10,
        marginRight: 10,
    },
});

const query$ = new BehaviorSubject({ query: 0 });

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: { artist: '', title: '', name: '', spotify: '', youtube: '', background: '', flickrPhotos: [], wikimediaPhotos: [] },
            user: {},
            photo: '',
            contribution: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = name => event => {
        const value = event.target.value;
        this.setState({ song: { ...this.state.song, [name]: value } })
    }

    handleStatus = (event, newStatus) => {
        this.setState({ song: { ...this.state.song, 'status': newStatus } })
      };

    handleFlickrChange(event) {
        const { value } = event.target;

        const flickrPhotos = [...this.state.song.flickrPhotos];
        flickrPhotos[0] = value;

        this.handlePictureUpdate(value);

        this.setState({
            song: { ...this.state.song, 'flickrPhotos': flickrPhotos }
        });
    }

    handleWikimediaUrlChange(event) {
        const { value } = event.target;

        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        if (wikimediaPhotos.length === 0) {
            const emptyWikimediaPhoto = {};
            emptyWikimediaPhoto.url = '';
            emptyWikimediaPhoto.attribution = '';
            wikimediaPhotos.push(emptyWikimediaPhoto)
        }
        wikimediaPhotos[0].url = value;

        this.handlePictureUpdate(value);

        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos }
        });
    }

    handleWikimediaAttributionChange(event) {
        const { value } = event.target;

        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        if (wikimediaPhotos.length === 0) {
            const emptyWikimediaPhoto = {};
            emptyWikimediaPhoto.url = '';
            emptyWikimediaPhoto.attribution = '';
            wikimediaPhotos.push(emptyWikimediaPhoto)
        }
        wikimediaPhotos[0].attribution = value;

        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        songService.updateSong(this.state.song, this.state.user);
    }

    handlePictureUpdate(pictureValue) {
        if (this.state.song.wikimediaPhotos.length > 0) {
            this.setState({ song: { ...this.state.song, 'artistImage': pictureValue } })
        } else if (this.state.song.flickrPhotos.length > 0) {
            songService.getFlickrPhotoInfo(pictureValue).then(photo => {
                console.log(photo);
                const flickrUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`
                this.setState({ song: { ...this.state.song, 'artistImage': flickrUrl } });
            }).catch(error => {
                console.log('Unknown id ' + this.state.song.flickrPhotos[0]);
            });
        }
    }

    updateFlickr(event) {
        const { name, value } = event.query;
        const index = event.index;

        const flickrPhotos = [...this.state.song.flickrPhotos];
        flickrPhotos[index] = value;
        this.setState({
            song: { ...this.state.song, [name]: flickrPhotos }
        });
        let self = this;
        songService.getFlickrPhotoInfo(flickrPhotos[0]).then(photo => {
            this.setState({
                photo: photo,
                contribution: photo.contribution
            });
        }).catch(function (error) {
            self.setState({
                contribution: ''
            });
        });
    }

    componentDidMount() {
        const obs = query$.asObservable();
        const dobs = obs.pipe(debounce(() => timer(500)));
        this.subscription = dobs.subscribe(event => this.updateFlickr(event));

        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        const songId = this.props.match.params.id;

        songService.getSong(songId).then(song => {
            this.setState({ song });
            if (song.flickrPhotos.length > 0) {
                songService.getFlickrPhotoInfo(song.flickrPhotos[0]).then(photo => {
                    this.setState({
                        photo: photo,
                        contribution: photo.contribution
                    });
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.subscription !== null) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        const { classes } = this.props;

        const song = this.state.song;
        const url = song.wikimediaPhotos.length > 0 ? song.wikimediaPhotos[0].url : '';
        const attribution = song.wikimediaPhotos.length > 0 ? song.wikimediaPhotos[0].attribution : '';
        const flickrId = song.flickrPhotos.length > 0 ? song.flickrPhotos[0] : '';

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>{song.artist} - {song.title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <TextField
                                required
                                id="artist"
                                label="Artist"
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                value={song.artist}
                                onChange={this.handleChange('artist')}
                                margin="normal"
                            />
                            <TextField
                                required
                                id="title"
                                label="Title"
                                value={song.title}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('title')}
                                margin="normal"
                            />
                            <TextField
                                required
                                id="name"
                                label="Name"
                                value={song.name}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <ToggleButtonGroup size="large" value={song.status} className={classes.toggleButtons} exclusive onChange={this.handleStatus}>
                                <ToggleButton key={1} value="SHOW">
                                    <Typography variant="subtitle1" className={classes.toggleButtonText} gutterBottom>Tonen</Typography>
                                </ToggleButton>
                                <ToggleButton key={2} value="IN_PROGRESS">
                                    <Typography variant="subtitle1" className={classes.toggleButtonText} gutterBottom>Te bewerken</Typography>
                                </ToggleButton>
                                <ToggleButton key={3} value="TO_BE_DELETED">
                                    <Typography variant="subtitle1" className={classes.toggleButtonText} gutterBottom>Te verwijderen</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <TextField
                                id="youtube"
                                label="Youtube"
                                value={song.youtube}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('youtube')}
                                margin="normal"
                            />
                            <TextField
                                id="spotify"
                                label="Spotify"
                                value={song.spotify}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('spotify')}
                                margin="normal"
                            />
                            <TextField
                                id="wikimediaUrl"
                                label="Wikimedia URL"
                                value={url}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={event => this.handleWikimediaUrlChange(event)}
                                margin="normal"
                            />
                            <TextField
                                id="wikimediaAttribution"
                                label="Wikimedia Attribution"
                                value={attribution}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={event => this.handleWikimediaAttributionChange(event)}
                                margin="normal"
                            />
                            <TextField
                                id="flickrId"
                                label="Flickr Photo Id"
                                value={flickrId}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={event => this.handleFlickrChange(event)}
                                margin="normal"
                            />
                            <TextField
                                id="background"
                                label="Background"
                                placeholder="Achtergrondinformatie over het nummer"
                                multiline
                                value={song.background}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.multilineInput,
                                        underline: classes.underline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('background')}
                                margin="dense"
                            />
                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} type="submit">
                                Opslaan
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ExpansionPanel className={classes.expansionPanel} defaultExpanded={true}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="background-content"
                                id="background-header"
                            >
                                <Typography variant="h5" gutterBottom>Geformatteerde achtergrond tekst</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div className="song-text-container">
                                    <content className="song-text"><ReactMarkdown source={this.state.song.background} /></content>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel className={classes.expansionPanel}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="youtube-spotify-content"
                                id="youtube-spotify-header"
                            >
                                <Typography variant="h5" gutterBottom>YouTube en Spotify</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div className="spotify">
                                    <iframe src={`https://open.spotify.com/embed/track/${song.spotify}`} className="spotify" width="100%" height="80px" title={song.title} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                </div>
                                <div className="youtube">
                                    <iframe src={`https://www.youtube.com/embed/${song.youtube}?rel=0`} width="80%" height="100%" title={song.title}></iframe>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel className={classes.expansionPanel}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="image-content"
                                id="image-header"
                            >
                                <Typography variant="h5" gutterBottom>Foto artiest</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    <img className="artistImage"
                                        src={song.artistImage}
                                        alt={song.artist}
                                    />
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            </div >
        );
    }
}

SongDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongDetail);
