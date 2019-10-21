import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './SongsPage.css';
import { withStyles } from '@material-ui/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
        flexGrow: 1,
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

class SongsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            filters: ['SHOW']
        };
    }

    componentDidMount() {
        songService.getDone().then(songs => {
            this.setState({ songs })
        }
        );
    }

    handleChange = name => event => {
        const filterValue = event.target.value;
        if (this.state.filters.includes(filterValue)) {
            this.setState({ filters: this.state.filters.filter(i => i !== filterValue) });

        } else {
            this.setState({ filters: this.state.filters.concat(filterValue) });
        }
    };

    render() {
        const { songs } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Nummers</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div id="switchesWrapper">
                            <FormGroup id="switches">
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filters.includes('SHOW')} onChange={this.handleChange('SHOW')} value="SHOW" color="primary" />
                                    }
                                    label="Actieve nummers"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filters.includes('IN_PROGRESS')} onChange={this.handleChange('IN_PROGRESS')} value="IN_PROGRESS" color="secondary" />
                                    }
                                    label="Nummers in bewerking"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={this.state.filters.includes('TO_BE_DELETED')} onChange={this.handleChange('TO_BE_DELETED')} value="TO_BE_DELETED" color="secondary" />
                                    }
                                    label="Nummers te verwijderen"
                                    labelPlacement="start"
                                />
                            </FormGroup>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Link key='new' to={'/songs/new'}>
                            <Button id="newSong" variant="contained" color="primary">
                                Nieuw nummer invoeren
                                </Button>
                        </Link>
                    </Grid>
                    {songs.length > 0 && songs.filter(song => this.state.filters.includes(song.status)).map((song, index) =>
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
                    {songs.length === 0 &&
                        <Grid item xs={12}>
                            <div id="progressWrapper">
                                <CircularProgress id="progress" size="6rem" thickness={4.5} />
                            </div>
                        </Grid>
                    }
                </Grid>
            </div>
        )
    }
}

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);