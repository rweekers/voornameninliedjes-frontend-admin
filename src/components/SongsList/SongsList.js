import React from 'react';
import { from, interval, zip } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './SongsList.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    card: {
        height: 400,
    },
    media: {
        height: 280,
        backgroundPosition: '0% 1%',
    },
    progress: {
        margin: 10,
    },
});

const INITIAL_CAP_SIZE = 100;
const BUFFER_SIZE = 100;
const LOADING_INTERVAL_TIME = 50;

class SongsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            songs: [],
        }
    }

    componentDidMount() {
        const songs = this.props.songs.length > INITIAL_CAP_SIZE ? this.props.songs.slice(0, INITIAL_CAP_SIZE) : this.props.songs;

        this.setState({
            'songs': songs,
        });

        // Create interval observable, push element to state in batches
        const restOfSongs = this.props.songs.slice(INITIAL_CAP_SIZE);
        const interval$ = interval(LOADING_INTERVAL_TIME);

        const restOfSongs$ = from(restOfSongs);

        const songs$ = zip(interval$, restOfSongs$);

        this.subscription = songs$
            .pipe(
                map(([_, song]) => song),
                bufferCount(BUFFER_SIZE, BUFFER_SIZE)
            )
            .subscribe(song => {
                const songList = this.state.songs.concat(song);
                this.setState({
                    'songs': songList,
                })
            });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        const { classes } = this.props;

        return <div className={classes.root} key="songList">
            <Grid container spacing={3}>
                {this.state.songs && this.state.songs.length > 0 && this.state.songs.map((song, index) =>
                    <Grid key={song.id} item xs={12} sm={6} md={4} lg={3}>
                        <Link key={song.id} to={'/songs/' + song.id}>
                            <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.media}
                                        image={song.artistImage}
                                        title={song.artist}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {song.artist} - {song.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {song.background}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                )}
                {this.state.songs && this.state.songs.length === 0 &&
                    <Grid item xs={12}>
                        <div id="progressWrapper">
                            <CircularProgress id="progress" size="6rem" thickness={4.5} />
                        </div>
                    </Grid>
                }
            </Grid>
        </div>
    }
}

SongsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsList);
