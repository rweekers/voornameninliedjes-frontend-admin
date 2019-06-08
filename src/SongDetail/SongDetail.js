import React from 'react';
import { songService } from '../services/song.service';
import './SongDetail.css';

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: { artist: 'loading', title: 'loading', name: 'loading', spotify: 'loading', youtube: 'loading', background: 'loading', flickrPhotos: [] },
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
                                    <label>Achtergrond:</label>
                                    <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
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
                                    {song.flickrPhotos.map((item, index) => (
                                        <div key={`div-$index`}>
                                            <label key={`label-$index`}>Flickr foto {index + 1}:</label>
                                            <input key={`input-$index`} type="text" name={'flickrPhotos'} value={item} onChange={event => this.handleArrayChange(event, index)} />
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </content>
                        <content className="song-metadata">
                            <fieldset>
                                <legend>Achtergrond en media</legend>
                                <div className="line">
                                    <label>Achtergrond:</label>
                                    <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                                </div>
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