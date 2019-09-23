import React from 'react';
import { Link } from 'react-router-dom';
import { songService } from '../services/song.service';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
                <Button onClick={(e) => this.handleClick('SHOW')} disabled={this.state.filter === 'SHOW'} variant="contained" color="primary">
                    Show active
                </Button>
                <Button onClick={(e) => this.handleClick('IN_PROGRESS')} disabled={this.state.filter === 'IN_PROGRESS'} variant="contained" color="primary">
                    Show in progress
                </Button>
                <Button onClick={(e) => this.handleClick('TO_BE_DELETED')} disabled={this.state.filter === 'TO_BE_DELETED'} variant="contained" color="primary">
                    Show to be deleted
                </Button>
                <Link to={'/songs/new'}>
                    <Button variant="contained" color="secondary">
                        Nieuw nummer invoeren
                </Button>
                </Link>
                {songs.length > 0 &&
                    <ul>
                        {songs.filter(song => song.status === this.state.filter).map((song, index) =>
                            <li key={song.id}>
                                <Typography variant="body1" gutterBottom>
                                    <Link to={'/songs/' + song.id}>{song.artist} - {song.title} [{song.status}]</Link>
                                </Typography>
                            </li>
                        )}
                    </ul>
                }
            </div>
        );
    }
}

export { SongsPage };