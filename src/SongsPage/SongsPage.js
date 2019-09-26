import React from 'react';
import { Link } from 'react-router-dom';
import { songService } from '../services/song.service';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import './SongsPage.css';

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

    useStyles() {
        makeStyles(theme => ({
            root: {
                padding: theme.spacing(3, 2),
            },
        }));
    }

    render() {
        const { songs } = this.state;
        // const classes = this.useStyles();
        const classes = makeStyles(theme => ({
            root: {
                padding: theme.spacing(3, 2),
            },
        }));
        console.log('root ' + classes);
        console.log('root ' + classes.root);

        return (
            <div>
                <Typography variant="h3" gutterBottom>Nummers</Typography>
                <Button onClick={(e) => this.handleClick('SHOW')} disabled={this.state.filter === 'SHOW'} variant="contained" color="primary">
                    Actieve nummers
                </Button>
                <Button onClick={(e) => this.handleClick('IN_PROGRESS')} disabled={this.state.filter === 'IN_PROGRESS'} variant="contained" color="primary">
                    Nummers in bewerking
                </Button>
                <Button onClick={(e) => this.handleClick('TO_BE_DELETED')} disabled={this.state.filter === 'TO_BE_DELETED'} variant="contained" color="primary">
                    Nummers te verwijderen
                </Button>
                <Link to={'/songs/new'}>
                    <Button variant="contained" color="secondary">
                        Nieuw nummer invoeren
                </Button>
                </Link>
                {songs.length > 0 &&
                    <div>
                        {songs.filter(song => song.status === this.state.filter).map((song, index) =>
                            <Link key={song.id} to={'/songs/' + song.id}>
                                <Paper>
                                    <Typography variant="h5" component="h3">
                                        {song.artist}
                                    </Typography>
                                    <Typography component="p">
                                        {song.title}
                                    </Typography>
                                </Paper>
                            </Link>
                        )}
                    </div>
                }
            </div>
        );
    }
}

export { SongsPage };