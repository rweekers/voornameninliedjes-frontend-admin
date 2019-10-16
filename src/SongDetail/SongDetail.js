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
        color: 'yellow',
        // fontSize: 12,
        marginTop: 19,
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
    dense: {
        marginTop: 19,
    },
    notchedOutline: {
        borderWidth: "1px",
        borderColor: "lightgrey !important",
    },
});

const query$ = new BehaviorSubject({ query: 0 });

let showPhoto = true;

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
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addNewPhoto = this.addNewPhoto.bind(this);
        this.addNewWikimediaPhoto = this.addNewWikimediaPhoto.bind(this);
    }

    handleChange = name => event => {
        const value = event.target.value;
        this.setState({ song: { ...this.state.song, [name]: value } })
    };

    handleArrayChange(event, index) {
        const { name, value } = event.target;

        const flickrPhotos = [...this.state.song.flickrPhotos];
        flickrPhotos[index] = value;
        this.setState({
            song: { ...this.state.song, [name]: flickrPhotos }
        });

        query$.next({ "query": event.target, "index": index });
    }

    handleWikimediaChange(event, index) {
        const { value } = event.target;

        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        wikimediaPhotos[0].url = value;

        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos }
        });
        console.log(this.state.song);
    }

    handleWikimediaChange2(event, index) {
        const { value } = event.target;

        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        wikimediaPhotos[0].attribution = value;

        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos }
        });
        console.log(this.state.song);
    }

    handleSubmit(event) {
        event.preventDefault();
        songService.updateSong(this.state.song, this.state.user);
    }

    addNewPhoto() {
        let newPhoto = '';
        const flickrPhotos = [...this.state.song.flickrPhotos];
        flickrPhotos.push(newPhoto);
        this.setState({
            song: { ...this.state.song, 'flickrPhotos': flickrPhotos }
        });
    }

    addNewWikimediaPhoto() {
        let newPhoto = {};
        newPhoto.url = '';
        newPhoto.attribution = '';
        const wikimediaPhotos = [...this.state.song.wikimediaPhotos];
        wikimediaPhotos.push(newPhoto);
        this.setState({
            song: { ...this.state.song, 'wikimediaPhotos': wikimediaPhotos }
        });
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
            showPhoto = true;
            this.setState({
                photo: photo,
                contribution: photo.contribution
            });
        }).catch(function (error) {
            showPhoto = false;
            self.setState({
                photo: '',
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
        const photo = this.state.photo;
        const contribution = this.state.contribution;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>{song.artist} - {song.title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <form className={classes.container} noValidate autoComplete="off">
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('title')}
                                margin="normal"
                                variant="outlined"
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                variant="outlined"
                            />
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('youtube')}
                                margin="normal"
                                variant="outlined"
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('spotify')}
                                margin="normal"
                                variant="outlined"
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('spotify')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="wikimediaUrl"
                                label="Wikimedia URL"
                                value={song.spotify}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('wikimediaUrl')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="wikimediaAttribution"
                                label="Wikimedia Attribution"
                                value={song.spotify}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('wikimediaAttribution')}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="flickrId"
                                label="Flickr Photo Id"
                                value={song.spotify}
                                className={classes.textField}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('flickrId')}
                                margin="normal"
                                variant="outlined"
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
                                        notchedOutline: classes.notchedOutline,
                                    }
                                }}
                                fullWidth={true}
                                onChange={this.handleChange('background')}
                                variant="outlined"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className="song-text-container">
                            <content className="song-text"><ReactMarkdown source={this.state.song.background} /></content>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        Blabla en zo
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
