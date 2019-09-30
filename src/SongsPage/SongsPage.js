import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { songService } from '../services/song.service';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './SongsPage.css';
import MaterialButton from '../material-coponents/MaterialButton';
import { withStyles } from '@material-ui/styles';
// import MaterialPaper from '../material-coponents/MaterialPaper';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 1,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        width: 100,
        padding: '0 30px',
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
        songService.getDone().then(songs => this.setState({ songs }));
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
            <div>
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
                <Link to={'/songs/new'}>
                    <Button variant="contained" color="secondary">
                        Nieuw nummer invoeren
                </Button>
                    <MaterialButton />
                </Link>
                {songs.length > 0 &&
                    <div>
                        {songs.filter(song => this.state.filters.includes(song.status)).map((song, index) =>
                            <Link key={song.id} to={'/songs/' + song.id}>
                                {/* <MaterialPaper /> */}
                                <Paper className={classes.root}>
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

SongsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsPage);