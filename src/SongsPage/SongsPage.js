import React from 'react';
import { Link } from 'react-router-dom';
import { songService } from '../services/song.service';

class SongsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        songService.getDone().then(songs => this.setState({ songs }));
    }

    render() {
        const { songs } = this.state;
        return (
            <div>
                <h3>Songs</h3>
                {songs.length > 0 &&
                    <ul>
                        {songs.filter(song => song.status === 'SHOW').map((song, index) =>
                            <li key={song.id}>
                                <Link to={'/songs/' + song.id}>{song.artist} - {song.title} [{song.status}]</Link>
                            </li>
                        )}
                    </ul>
                }
            </div>
        );
    }
}

export { SongsPage };