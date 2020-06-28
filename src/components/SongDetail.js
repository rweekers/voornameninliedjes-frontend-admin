import React from 'react';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactMarkdown from 'react-markdown';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SourceFormDialog from './SourceFormDialog';
import CustomSnackBar from './CustomSnackBar';

const styles = theme => ({
    songText: {
        color: 'whitesmoke',
        fontSize: '1.5em',
    },
    artistImage: {
        maxWidth: '100%',
    },
    previewWebsiteWrapper: {
        width: '100%',
        height: '800px',
    },
    previewWebsite: {
        width: '100%',
        height: '100%',
        border: 'none',
    },

    root: {
        flexGrow: 1,
        '& a': {
            textDecoration: 'none',
            color: 'white',
        },
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
    link: {
        color: 'white',
        fontSize: 18,
        textAlign: 'left',
        "&:hover": {
            color: 'orange',
        }
    },
    iconButton: {
        color: 'white',
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
    sourcesExpansionPanel: {
        color: "lightgrey",
        backgroundColor: "#424242",
        marginLeft: 10,
        marginRight: 10,
        width: "100%",
        textAlign: 'left',
        paddingBottom: '4px',
        paddingTop: '4px',
    },
    dialog: {
    },
    dialogContent: {
        backgroundColor: "#424242",
    },
    dialogContentText: {
        color: 'white',
        fontSize: 16,
    },
    dialogTitle: {
        color: 'white',
        backgroundColor: "#424242",
    },
    dialogActions: {
        color: "lightgrey",
        backgroundColor: "#424242",
    },
    error: {
        fontSize: 15,
    },
    snackbarSuccess: {
        backgroundColor: 'green',
        color: 'white',
        fontSize: 16,
        justifyContent: 'center',
        minWidth: 900,
    },
});

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: { artist: '', title: '', name: '', spotify: '', youtube: '', background: '', flickrPhotos: [], wikimediaPhotos: [], sources: [] },
            user: {},
            photo: '',
            contribution: '',
            artistError: '',
            titleError: '',
            nameError: '',
            youTubeError: '',
            spotifyError: '',
            backgroundError: '',
            licenseError: '',
            wikiMediaError: '',
            open: false,
            cancelOpen: false,
            messageType: '',
            messageText: '',
            routeToList: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleSourceCancel = this.handleSourceCancel.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.removeSong = this.removeSong.bind(this);
        this.setReroute = this.setReroute.bind(this);
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

    addSource() {
        const sources = [...this.state.song.sources];

        const source = {
            url: '',
            name: ''
        };
        sources.push(source);

        this.setState({
            song: { ...this.state.song, 'sources': sources }
        });
    }

    handleSourceChange(s, index) {
        const sources = [...this.state.song.sources];

        if (index >= 0) {
            sources.splice(index, 1, s);
        }

        this.setState({
            song: { ...this.state.song, 'sources': sources }
        });
    }

    handleSourceCancel() {
        const sources = [...this.state.song.sources];

        const updatedSources = sources.filter((item) => {
            return item.url !== '' && item.name !== ''
        });

        this.setState({
            song: { ...this.state.song, 'sources': updatedSources }
        });
    }

    handleDeleteDialogOpen() {
        this.setState({
            cancelOpen: true,
        });
    }

    handleDeleteDialogCancel() {
        this.setState({
            cancelOpen: false,
        });
    }

    handleDeleteDialogSave(index) {
        const sources = [...this.state.song.sources];

        if (index >= 0) {
            sources.splice(index, 1);
        }

        this.setState({
            cancelOpen: false,
            song: { ...this.state.song, 'sources': sources }
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
        
        let message = '';

        if (this.state.song.id) {
            console.log(`updating song with id ${this.state.song.id}`);
            songService.updateSong(this.state.song, this.state.user);
            message = 'Nummer bijgewerkt';
            this.handleClick('success', message);
        } else {
            console.log('inserting song');
            let song = this.state.song;
            songService.insertSong(song, this.state.user)
                .then(song => {
                    this.setState({ song: { ...this.state.song, id: song.id } });
                    this.props.history.replace(`/songs/${song.id}`);
                });
            message = 'Nummer aangemaakt';
            this.handleClick('success', message);
        }

        if (this.state.routeToList) {
            this.props.history.push({
                pathname: '/songs',
                messageType: 'success',
                messageText: message,
            });
        }
    }

    removeSong() {
        songService.removeSong(this.state.song.id);
        this.props.history.push({
                pathname: '/songs',
                messageType: 'success',
                messageText: 'Nummer verwijderd',
            });
    }

    handleCancelClick() {
        this.props.history.push('/songs');
    }

    isEmpty(str) {
        return (!str || 0 === str.length);
    }

    clearValidations() {
        this.setState({
            'artistError': '',
            'titleError': '',
            'nameError': '',
            'youTubeError': '',
            'spotifyError': '',
            'backgroundError': '',
            'licenseError': '',
            'wikiMediaError': '',
        });
    }

    isValid(song) {
        let isValid = true;

        const titleWords = song.title.split(' ');
        if (!titleWords.includes(song.name)) {
            this.setState({
                open: true,
                messageType: 'error',
                messageText: 'De naam moet voorkomen in de titel van het nummer',
            });
            isValid = false;
        }

        if (!song.artist) {
            this.setState({ 'artistError': 'Artiest moet gevuld zijn' });
            isValid = false;
        }

        if (!song.title) {
            this.setState({ 'titleError': 'Titel moet gevuld zijn' });
            isValid = false;
        }

        if (!song.name) {
            this.setState({ 'nameError': 'Naam moet gevuld zijn' });
            isValid = false;
        }

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

        if (song.status === 'SHOW' && song.wikimediaPhotos.length === 0 && song.flickrPhotos.length === 0) {
            this.setState( {
                open: true,
                messageType: 'error',
                messageText: 'Let op: voeg minimaal 1 foto toe van de artiest',
            });
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

    handleClick(messageType, messageText) {
        this.setState({
            open: true,
            messageType: messageType,
            messageText: messageText,
        });
    }

    handleClose() {
        this.setState({
            open: false,
            messageType: '',
            messageText: '',
        });
    }

    setReroute(reroute) {
        this.setState({
            routeToList: reroute,
        })
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
                sources: [],
                status: 'IN_PROGRESS',
                artist: '', 
                title: '', 
                name: '', 
                spotify: '', 
                youtube: '', 
                background: '', 
                artistImage: ''
            };
            this.setState({ song });
        } else {
            songService.getSong(songId).then(song => {
                song.spotify = song.spotify ? song.spotify : '';
                song.youtube = song.youtube ? song.youtube : '';
                song.background = song.background ? song.background : '';
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

        console.log(song);

        const songUrl = `https://voornameninliedjes.nl/song/${song.id}`

        const user = this.state.user;

        return (
            <div className={classes.root} key={song.id}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>{song.artist} - {song.title} <a href={songUrl} target="_blank" rel="noopener noreferrer" hidden={!song.id}><MusicVideoIcon /></a></Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <TextField
                                required
                                id="artist"
                                label="Artiest"
                                value={song.artist}
                                error={!this.isEmpty(this.state.artistError)}
                                helperText={this.state.artistError}
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
                                    }
                                  }}
                                fullWidth={true}
                                onChange={this.handleChange('artist')}
                                margin="normal"
                            />
                            <TextField
                                required
                                id="title"
                                label="Titel"
                                value={song.title}
                                className={classes.textField}
                                error={!this.isEmpty(this.state.titleError)}
                                helperText={this.state.titleError}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
                                    }
                                  }}
                                fullWidth={true}
                                onChange={this.handleChange('title')}
                                margin="normal"
                            />
                            <TextField
                                required
                                id="name"
                                label="Naam"
                                value={song.name}
                                className={classes.textField}
                                error={!this.isEmpty(this.state.nameError)}
                                helperText={this.state.nameError}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
                                    }
                                  }}
                                fullWidth={true}
                                onChange={event => this.handleWikimediaAttributionChange(event)}
                                margin="normal"
                            />
                            <TextField
                                id="flickrId"
                                label="Flickr fotoId"
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
                                    }
                                  }}
                                fullWidth={true}
                                onChange={event => this.handleFlickrChange(event)}
                                margin="normal"
                            />
                            <TextField
                                required={song.status === 'SHOW'}
                                id="background"
                                label="Achtergrond"
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
                                FormHelperTextProps={{
                                    classes:{
                                      error: classes.error
                                    }
                                  }}
                                fullWidth={true}
                                onChange={this.handleChange('background')}
                                margin="dense"
                            />
                            <ExpansionPanel className={classes.sourcesExpansionPanel}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="sources-content"
                                    id="sources-header"
                                >
                                <Typography className={classes.heading}>Bronnen</Typography>
                                </ExpansionPanelSummary>
                                {song.sources.map((s, index) => (
                                    <ExpansionPanelDetails key={`source${index + 1}`}>
                                        <Grid container spacing={1} alignItems='center'>
                                            <Grid item xs={10}>
                                                <Link href={s.url} className={classes.link} underline='none' target='_blank' rel='noopener'>
                                                    {s.name}
                                                </Link>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <SourceFormDialog source={s} index={index} open={s.url === ''} onSourceCancel={this.handleSourceCancel} onSourceUpdate={this.handleSourceChange} />
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Tooltip title="Verwijderen">
                                                    <IconButton aria-label="delete" color="primary" className={classes.iconButton} onClick={event => this.handleDeleteDialogOpen()}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Dialog
                                                    open={this.state.cancelOpen}
                                                    onClose={event => this.handleDeleteDialogCancel}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                    BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' } }}
                                                    className={classes.dialog}
                                                >
                                                    <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>{"Bron verwijderen?"}</DialogTitle>
                                                    <DialogContent className={classes.dialogContent}>
                                                        <DialogContentText id="alert-dialog-description" className={classes.dialogContentText}>
                                                            {`Weet je zeker dat je bron ${s.name} wilt verwijderen?`}
                                                    </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions className={classes.dialogActions}>
                                                        <Button onClick={event => this.handleDeleteDialogCancel()} variant="contained" color="primary" className={classes.button}>
                                                            Annuleren
                                                    </Button>
                                                        <Button onClick={event => this.handleDeleteDialogSave(index)} variant="contained" color="primary" className={classes.button} autoFocus>
                                                            Verwijderen
                                                    </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelDetails>
                                ))}
                                <Divider />
                                <ExpansionPanelActions>
                                    <Button size="small" variant="contained" className={classes.button} color="primary" onClick={() => this.addSource()}>
                                        Bron toevoegen
                                    </Button>
                                </ExpansionPanelActions>
                            </ExpansionPanel>

                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} type="submit" onClick={() => this.setReroute(true)}>
                                Opslaan&Sluiten
                            </Button>
                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} type="submit" onClick={() => this.setReroute(false)}>
                                Opslaan
                            </Button>
                            {user.roles &&  user.roles.includes('OWNER') && (
                                <Button variant="contained" color="secondary" className={classes.button} fullWidth={true} onClick={this.removeSong} disabled={song.status !== 'TO_BE_DELETED'}>
                                    Verwijderen
                            </Button>
                            )}
                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} onClick={this.handleCancelClick}>
                                Sluiten
                            </Button>
                            <CustomSnackBar 
                                handleClose={this.handleClose} 
                                open={this.state.open} 
                                messageText={this.state.messageText}
                                variant={this.state.messageType}
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
                                    <content className={classes.songText}><ReactMarkdown source={this.state.song.background} /></content>
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
                                    <iframe src={`https://www.youtube-nocookie.com/embed/${song.youtube}?rel=0`} width="80%" height="100%" title={song.title}></iframe>
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
                                        <img className={classes.artistImage}
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
                                <div className={classes.previewWebsiteWrapper}>
                                    <iframe src={songUrl} title="preview-website" className={classes.previewWebsite} />
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
