import React from 'react';
import { songService } from '../services/song.service';

class SongDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            song: ''
        };
    }

    componentDidMount() {
        const songId = this.props.match.params.id;
        console.log(songId);
        songService.getSong(songId).then(song => this.setState({ song }));
    }

    render() {
        const song = this.state.song;
        return (
            <div>
                <h3>Song detail for {song.artist} with {song.title}</h3>
            </div>
        );
    }
}

export { SongDetail };