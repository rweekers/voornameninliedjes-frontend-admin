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
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        // maxWidth: 345,
    },
    media: {
        height: 140,
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
            <div className="songsFilter">
                <Container>
                    <div>
                        <Grid container direction="row" justify="center" alignItems="stretch" spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>Nummers</Typography>
                                <FormGroup row>
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
                                    /></FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Link key='new' to={'/songs/new'}>
                                    <Button variant="contained" color="primary">
                                        Nieuw nummer invoeren
                                </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
                {songs.length > 0 && songs.filter(song => this.state.filters.includes(song.status)).map((song, index) =>
                    <Grid container direction="row" justify="center" alignItems="stretch" spacing={3}>
                        <Grid item xs={4}>
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
                    </Grid>
                )}
            </div >
        );
    }
}

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);