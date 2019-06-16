import React from 'react';
import { Link } from 'react-router-dom';
import { songService } from '../services/song.service';

class SongsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            filter: 'SHOW'
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        songService.getDone().then(songs => this.setState({ songs }));
    }

    handleClick(status) {
        this.setState({ filter: status })        
    }

    render() {
        const { songs } = this.state;
        return (
            <div>
                <h3>Songs</h3>
                <button onClick={(e) => this.handleClick('SHOW')} disabled={this.state.filter === 'SHOW'}>
                    Show active
                </button>
                <button onClick={(e) => this.handleClick('IN_PROGRESS')} disabled={this.state.filter === 'IN_PROGRESS'}>
                    Show in progress
                </button>
                <button onClick={(e) => this.handleClick('TO_BE_DELETED')} disabled={this.state.filter === 'TO_BE_DELETED'}>
                    Show to be deleted
                </button>
                <Link to={'/songs/new'}>Nieuw nummer invoeren</Link>
                {songs.length > 0 &&
                    <ul>
                        {songs.filter(song => song.status === this.state.filter).map((song, index) =>
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