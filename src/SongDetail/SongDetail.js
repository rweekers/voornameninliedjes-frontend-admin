import React from 'react';
import { songService } from '../services/song.service';
import './SongDetail.css';

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: { artist: 'loading', title: 'loading', name: 'loading', background: 'loading', flickrPhotos: [] },
            user: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    }

    handleSubmit(event) {
        event.preventDefault();
        songService.updateSong(this.state.song, this.state.user);
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        const songId = this.props.match.params.id;
        songService.getSong(songId).then(song => this.setState({ song }));
    }

    render() {
        const song = this.state.song;
        return (
            <div className="Songdetail">
                <header className="song-title"><h2>{song.artist} - {song.title}</h2></header>
                <form onSubmit={this.handleSubmit}>
                    <content className="song-details">
                        <fieldset>
                            <legend>Details</legend>
                            <div class="line">
                                <label>Artiest:</label>
                                <input type="text" name="artist" value={this.state.song.artist} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>Naam:</label>
                                <input type="text" name="name" value={this.state.song.name} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>Title:</label>
                                <input type="text" name="title" value={this.state.song.title} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>Achtergrond:</label>
                                <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>YouTube:</label>
                                <input type="text" name="youtube" value={this.state.song.youtube} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>Spotify:</label>
                                <input type="text" name="spotify" value={this.state.song.spotify} onChange={this.handleChange} />
                            </div>
                            <div class="line">
                                <label>Status:</label>
                                <select name="status" value={this.state.song.status} onChange={this.handleChange}>
                                    <option value="SHOW">Tonen</option>
                                    <option value="IN_PROGRESS">Aan het bewerken</option>
                                    <option selected value="TO_BE_DELETED">Verwijderd</option>
                                </select>
                            </div>
                            <div class="line">
                                {song.flickrPhotos.map((item, index) => (
                                    <div>
                                        <label key={index}>Flickr foto {index + 1}:</label>
                                        <input type="text" name={'flickrPhotos'} value={item} onChange={event => this.handleArrayChange(event, index)} />
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </content>
                    <content className="song-metadata">
                        <fieldset>
                            <legend>Achtergrond en media</legend>
                            <div class="line">
                                <label>Achtergrond:</label>
                                <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                            </div>
                        </fieldset>
                    </content>
                    <input type="submit" value="Opslaan" />
                </form>
            </div >
        );
    }
}

export { SongDetail };