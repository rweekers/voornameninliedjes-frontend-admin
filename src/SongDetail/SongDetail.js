import React from 'react';
import { songService } from '../services/song.service';
import './SongDetail.css';
import { BehaviorSubject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';
import ReactMarkdown from 'react-markdown';

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

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ song: { ...this.state.song, [name]: value } })
    }

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
        const song = this.state.song;
        const photo = this.state.photo;
        const contribution = this.state.contribution;
        return (
            <div className="Songdetail">
                <form onSubmit={this.handleSubmit}>
                    <div className="SongdetailForm">
                        <header className="song-title"><h1>{song.artist} - {song.title}</h1></header>
                        <content className="song-details">
                            <fieldset>
                                <legend>Details</legend>
                                <div className="line">
                                    <label>Artiest:</label>
                                    <input type="text" name="artist" value={this.state.song.artist} onChange={this.handleChange} />
                                </div>
                                <div className="line">
                                    <label>Naam:</label>
                                    <input type="text" name="name" value={this.state.song.name} onChange={this.handleChange} />
                                </div>
                                <div className="line">
                                    <label>Title:</label>
                                    <input type="text" name="title" value={this.state.song.title} onChange={this.handleChange} />
                                </div>
                                <div className="line">
                                    <label>YouTube:</label>
                                    <input type="text" name="youtube" value={this.state.song.youtube} onChange={this.handleChange} />
                                </div>
                                <div className="line">
                                    <label>Spotify:</label>
                                    <input type="text" name="spotify" value={this.state.song.spotify} onChange={this.handleChange} />
                                </div>
                                <div className="line">
                                    <label>Status:</label>
                                    <select name="status" value={this.state.song.status} onChange={this.handleChange}>
                                        <option value="SHOW">Tonen</option>
                                        <option value="IN_PROGRESS">Aan het bewerken</option>
                                        <option value="TO_BE_DELETED">Verwijderd</option>
                                    </select>
                                </div>
                                <div className="line">
                                    <label>Flickr foto:</label>
                                    {song.flickrPhotos.map((item, index) => (
                                        <input key={index} type="text" name={'flickrPhotos'} value={item} onChange={event => this.handleArrayChange(event, index)} />
                                    ))}
                                </div>
                                {song.flickrPhotos.length === 0 && <button onClick={this.addNewPhoto}>
                                    Nieuwe foto toevoegen
                                </button>}
                                <div className="line">
                                    <label>Wikipedia foto:</label>
                                    {song.wikimediaPhotos.map((item, index) => (
                                        <div key={index}>
                                            <input type="text" name={'wikimediaUrl'} value={item.url} onChange={event => this.handleWikimediaChange(event, index)} />
                                            <input type="text" name={'wikimediaContribution'} value={item.attribution} onChange={event => this.handleWikimediaChange2(event, index)} />
                                        </div>
                                    ))}
                                </div>
                                {song.wikimediaPhotos.length === 0 && <button onClick={this.addNewWikimediaPhoto}>
                                    Nieuwe wikimedia foto toevoegen
                                </button>}
                                {/* TODO Add logs when sorting is ok */}
                                {/* {song.logs && <div>
                                    <ul>
                                        {song.logs.sort((a, b) => Date.parse(a.date) < Date.parse(b.date)).map((log, index) =>
                                            <li key={index}>
                                                <p>{log.date} - {log.user}</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>} */}
                            </fieldset>
                        </content>
                        <content className="song-metadata">
                            <fieldset>
                                <legend>Achtergrond en media</legend>
                                <div>
                                    <label>Achtergrond:</label>
                                    <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                                    <content className="song-text"><ReactMarkdown source={this.state.song.background} /></content>
                                </div>
                                <div>
                                    <label>YouTube:</label>
                                    <iframe src={`https://www.youtube.com/embed/${song.youtube}?rel=0`} width="80%" height="100%" title={song.title}></iframe>
                                </div>
                                <div>
                                    <label>Spotify:</label>
                                    <iframe src={`https://open.spotify.com/embed/track/${song.spotify}`} className="spotify" width="100%" height="80px" title={song.title} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                </div>
                                {showPhoto &&
                                    <div>
                                        <label>Flickr photo:</label>
                                        <img
                                            src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`}
                                            alt={photo.title}
                                        />
                                        <div className="attribution"><a href={contribution.photoUrl} target="_blank" rel="noopener noreferrer">Photo</a> by <a href={contribution.ownerUrl} target="_blank" rel="noopener noreferrer">{contribution.ownerName}</a> / <a href={contribution.licenseUrl} target="_blank" rel="noopener noreferrer">{contribution.licenseName}</a></div>
                                    </div>}
                                {!showPhoto && <div><h1>Geen geldig Flickr id!</h1></div>}
                            </fieldset>
                        </content>
                        <content className="song-footer">
                            <input type="submit" value="Opslaan" />
                        </content>
                    </div>
                </form>
            </div >
        );
    }
}

export { SongDetail };