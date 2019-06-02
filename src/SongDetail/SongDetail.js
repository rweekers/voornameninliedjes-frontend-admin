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
            <div>
                <h2>{song.artist} - {song.title}</h2>
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Hi!</legend>
                        <div>
                            <label>Artist:</label>
                            <input type="text" name="artist" value={this.state.song.artist} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={this.state.song.name} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Title:</label>
                            <input type="text" name="title" value={this.state.song.title} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Background:</label>
                            <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>YouTube:</label>
                            <textarea name="youtube" value={this.state.song.youtube} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Spotify:</label>
                            <textarea name="spotify" value={this.state.song.spotify} onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select name="status" value={this.state.song.status} onChange={this.handleChange}>
                                <option value="SHOW">Tonen</option>
                                <option value="IN_PROGRESS">Aan het bewerken</option>
                                <option selected value="TO_BE_DELETED">Verwijderd</option>
                            </select>
                        </div>
                        {song.flickrPhotos.map((item, index) => (
                            <div>
                                <label key={index}>Flickr photo {index + 1}:</label>
                                <input type="text" name={'flickrPhotos'} value={item} onChange={event => this.handleArrayChange(event, index)} />
                            </div>
                        ))}
                        <br />
                        <input type="submit" value="Submit" />
                    </fieldset>
                </form>
            </div >
        );
    }
}

export { SongDetail };