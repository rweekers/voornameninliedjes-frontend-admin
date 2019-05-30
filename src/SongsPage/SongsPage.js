import React from 'react';
import { songService } from '../services/song.service';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';

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
                {songs.length &&
                    <ul>
                        {songs.filter(song => song.status === 'SHOW').map((song, index) =>
                            <li key={song.id}>
                                <PrivateRoute exact path="/songs/:id" component={Songdetail} />
                                <Link to={'/songs/' + song.id}>{song.artist} - {song.title} [{song.status}]</Link>
                            </li>
                        )}
                    </ul>
                }
            </div>
        );
    }
}

function Songdetail() {
    return <h2>Song detail</h2>;
}

export { SongsPage };