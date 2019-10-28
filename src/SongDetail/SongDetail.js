import React from 'react';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import './SongDetail.css';
import { withStyles } from '@material-ui/styles';
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
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import ReactMarkdown from 'react-markdown';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

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

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: { artist: '', title: '', name: '', spotify: '', youtube: '', background: '', flickrPhotos: [], wikimediaPhotos: [] },
            user: {},
            photo: '',
            contribution: '',
            youTubeError: '',
            spotifyError: '',
            backgroundError: '',
            licenseError: '',
            wikiMediaError: '',
            open: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange = name => event => {
        this.clearValidations();

        const value = event.target.value;
        this.setState({ song: { ...this.state.song, [name]: value } })
    }

    handleStatus = (event, newStatus) => {
        this.clearValidations();

        this.setState({ song: { ...this.state.song, 'status': newStatus } })
    };

    handleFlickrChange(event) {
        this.clearValidations();

        const { value } = event.target;

        const flickrPhotos = [...this.state.song.flickrPhotos];
        flickrPhotos[0] = value;

        if (!value) {
            flickrPhotos.pop();
        }

        this.handlePictureUpdate(value);

        this.setState({
            song: { ...this.state.song, 'flickrPhotos': flickrPhotos }
        });
    }

    handleWikimediaUrlChange(event) {
        this.clearValidations();

        const { value } = event.target;

        if (!value) {
            // picture is empty, check if flickr needs updating
            if (this.state.song.flickrPhotos.length > 0) {
                this.handlePictureUpdate(this.state.song.flickrPhotos[0]);
            }
        }

        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        if (wikimediaPhotos.length === 0) {
            const emptyWikimediaPhoto = {};
            emptyWikimediaPhoto.url = '';
            emptyWikimediaPhoto.attribution = '';
            wikimediaPhotos.push(emptyWikimediaPhoto)
        }
        wikimediaPhotos[0].url = value;

        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos, 'artistImage': value },
        });
    }

    handleWikimediaAttributionChange(event) {
        this.clearValidations();

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

        const song = this.state.song;

        if (!this.isValid(song)) {
            return;
        }

        songService.updateSong(this.state.song, this.state.user);

        // Add insert song (and return id) to navigate to page when inserting
        // Add snackbar as feedback element

        this.handleClick();

        // this.props.history.push('/about');
    }

    isEmpty(str) {
        return (!str || 0 === str.length);
    }

    clearValidations() {
        this.setState({
            'youTubeError': '',
            'spotifyError': '',
            'backgroundError': '',
            'licenseError': '',
            'wikiMediaError': '',
        });
    }

    isValid(song) {
        let isValid = true;

        if (song.status === 'SHOW' && !song.youtube) {
            this.setState({ 'youTubeError': 'YouTube link moet gevuld zijn' });
            isValid = false;
        }

        if (song.status === 'SHOW' && !song.spotify) {
            this.setState({ 'spotifyError': 'Spotify Id moet gevuld zijn' });
            isValid = false;
        }

        if (song.status === 'SHOW' && !song.background) {
            this.setState({ 'backgroundError': 'Achtergrond moet gevuld zijn' });
            isValid = false;
        }

        if (song.wikimediaPhotos.length > 0) {
            const wikimediaPhoto = song.wikimediaPhotos[0];
            if (this.isEmpty(wikimediaPhoto.url) && this.isEmpty(wikimediaPhoto.attribution)) {
                song.wikimediaPhotos.pop();
            }
            if ((this.isEmpty(wikimediaPhoto.url) && !this.isEmpty(wikimediaPhoto.attribution)) ||
                (!this.isEmpty(wikimediaPhoto.url) && this.isEmpty(wikimediaPhoto.attribution))) {
                this.setState({ 'wikiMediaError': 'Zowel url als attribution moeten gevuld zijn' });
                isValid = false;
            }
        }
        return isValid;

    }

    handlePictureUpdate(pictureValue) {
        // See https://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html
        const validLicenses = ['1', '2', '3', '4', '5', '6', '7'];

        if (this.state.song.flickrPhotos.length > 0) {
            songService.getFlickrPhotoInfo(pictureValue).then(photo => {
                console.log(photo.license);
                if (!validLicenses.includes(photo.license)) {
                    this.setState({ 'licenseError': 'Deze foto mag niet rechtenvrij gebruikt worden' });
                }
                const flickrUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`
                this.setState({ song: { ...this.state.song, 'artistImage': flickrUrl } });
            }).catch(error => {
                console.log('Unknown id ' + this.state.song.flickrPhotos[0]);
                this.setState({ song: { ...this.state.song, 'artistImage': '' } });
            });
        }
    }

    handleClick() {
        this.setState({
            open: true,
        });
    }

    handleClose() {
        this.setState({
            open: false,
        });
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        const songId = this.props.match.params.id;

        if (songId === 'new') {
            const song = {
                wikimediaPhotos: [],
                flickrPhotos: [],
                status: 'IN_PROGRESS',
                artistImage: ''
            };
            this.setState({ song })
        } else {
            songService.getSong(songId).then(song => {
                this.setState({ song });
            });
        }
    }

    render() {
        const { classes } = this.props;

        const song = this.state.song;
        const url = song.wikimediaPhotos.length > 0 ? song.wikimediaPhotos[0].url : '';
        const attribution = song.wikimediaPhotos.length > 0 ? song.wikimediaPhotos[0].attribution : '';
        const flickrId = song.flickrPhotos.length > 0 ? song.flickrPhotos[0] : '';

        const songUrl = `https://voornameninliedjes.nl/song/${song.id}`

        const key = `${song.artist}#${song.title}`;

        return (
            <div className={classes.root} key={key}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>{song.artist} - {song.title} <a href={songUrl} target="_blank" rel="noopener noreferrer" hidden={!song.id}><MusicVideoIcon /></a></Typography>
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
                                required={song.status === 'SHOW'}
                                id="youtube"
                                label="Youtube"
                                value={song.youtube}
                                className={classes.textField}
                                error={!this.isEmpty(this.state.youTubeError)}
                                helperText={this.state.youTubeError}
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
                                required={song.status === 'SHOW'}
                                id="spotify"
                                label="Spotify"
                                value={song.spotify}
                                className={classes.textField}
                                error={!this.isEmpty(this.state.spotifyError)}
                                helperText={this.state.spotifyError}
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
                                error={!this.isEmpty(this.state.wikiMediaError)}
                                helperText={this.state.wikiMediaError}
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
                                error={!this.isEmpty(this.state.wikiMediaError)}
                                helperText={this.state.wikiMediaError}
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
                                error={!this.isEmpty(this.state.licenseError)}
                                helperText={this.state.licenseError}
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
                                required={song.status === 'SHOW'}
                                id="background"
                                label="Background"
                                placeholder="Achtergrondinformatie over het nummer"
                                multiline
                                value={song.background}
                                className={classes.textField}
                                error={!this.isEmpty(this.state.backgroundError)}
                                helperText={this.state.backgroundError}
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
                            <Snackbar
                                open={this.state.open}
                                onClose={this.handleClose}
                                onClick={this.handleClose}
                                autoHideDuration={3000}
                                TransitionComponent={Fade}
                                ContentProps={{
                                    'aria-describedby': 'message-id',
                                }}
                                message={<span id="message-id">Nummer succesvol geupdatet</span>}
                            />
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
                                    {song.artistImage &&
                                        <img className="artistImage"
                                            src={song.artistImage}
                                            alt={song.artist}
                                        />}
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel className={classes.expansionPanel}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="preview-content"
                                id="preview-header"
                            >
                                <Typography variant="h5" gutterBottom>Preview website</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div className="preview-website-wrapper">
                                    <iframe src={songUrl} title="preview-website" className="preview-website" />
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
