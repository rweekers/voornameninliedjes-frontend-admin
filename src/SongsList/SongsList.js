import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './SongsList.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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

export default function SongsList(props) {
    const classes = useStyles();

    return <div className={classes.root}>
        <Grid container spacing={3}>
            {props.songs.length > 0 && props.songs.map((song, index) =>
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
            {props.songs.length === 0 &&
                <Grid item xs={12}>
                    <div id="progressWrapper">
                        <CircularProgress id="progress" size="6rem" thickness={4.5} />
                    </div>
                </Grid>
            }
        </Grid>
    </div>
}

