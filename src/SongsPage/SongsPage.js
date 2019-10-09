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
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: 'gray',
    },
    gridList: {
        width: 500,
        height: 450,
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
            songs.map(song => this.setImage(song))
            this.setState({ songs })
        }
        );
    }

    setImage(song) {
        if (song.wikimediaPhotos.length > 0) {
            song.image = song.wikimediaPhotos[0].url;
            return;
        }
        song.image = 'https://material-ui.com/static/images/grid-list/hats.jpg';
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
                <Typography variant="h3" gutterBottom>Nummers</Typography>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch checked={this.state.filters.includes('SHOW')} onChange={this.handleChange('SHOW')} value="SHOW" />
                        }
                        label="Actieve nummers"
                    />
                    <FormControlLabel
                        control={
                            <Switch checked={this.state.filters.includes('IN_PROGRESS')} onChange={this.handleChange('IN_PROGRESS')} value="IN_PROGRESS" />
                        }
                        label="Nummers in bewerking"
                    />
                    <FormControlLabel
                        control={
                            <Switch checked={this.state.filters.includes('TO_BE_DELETED')} onChange={this.handleChange('TO_BE_DELETED')} value="TO_BE_DELETED" />
                        }
                        label="Nummers te verwijderen"
                    /></FormGroup>
                <Link key='new' to={'/songs/new'}>
                    <Button variant="contained" color="secondary">
                        Nieuw nummer invoeren
                    </Button>
                </Link>
                <br />
                <GridList cellHeight={210} width={150} className={classes.gridList} cols={2}>
                    {songs.length > 0 && songs.filter(song => this.state.filters.includes(song.status)).map((song, index) =>
                        <GridListTile key={song.id}>
                            <Link key={song.id} to={'/songs/' + song.id}>
                                <img src={song.image} alt={song.artist} />
                                <GridListTileBar
                                    title={song.title}
                                    subtitle={<span>by: {song.artist}</span>}
                                />
                            </Link>
                        </GridListTile>
                    )}
                </GridList>
                }
            </div>
        );
    }
}

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);