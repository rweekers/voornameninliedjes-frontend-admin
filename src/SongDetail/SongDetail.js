import React from 'react';
import { songService } from '../services/song.service';

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
                    <label>
                        Artist: <input type="text" name="artist" value={this.state.song.artist} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Name: <input type="text" name="name" value={this.state.song.name} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Title: <input type="text" name="title" value={this.state.song.title} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Background: <textarea name="background" value={this.state.song.background} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        YouTube: <textarea name="youtube" value={this.state.song.youtube} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Spotify: <textarea name="spotify" value={this.state.song.spotify} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Status: <select name="status" value={this.state.song.status} onChange={this.handleChange}>
                            <option value="SHOW">Tonen</option>
                            <option value="IN_PROGRESS">Aan het bewerken</option>
                            <option selected value="TO_BE_DELETED">Verwijderd</option>
                        </select>
                    </label><br />
                    {song.flickrPhotos.map((item, index) => (
                        <label key={index}>
                            Flickr photo {index + 1}: <input type="text" name={'flickrPhotos'} value={item} onChange={event => this.handleArrayChange(event, index)} />
                        </label>
                    ))}
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div >
        );
    }
}

export { SongDetail };