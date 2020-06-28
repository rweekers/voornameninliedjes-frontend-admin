import React from 'react';
import PropTypes from 'prop-types';
import './LoginPage.css';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { userService } from '../../services/user.service';
import { UserContext } from '../../user-context';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: '20%',
        marginRight: '20%',
    },
    inputLabel: {
        color: 'lightgrey !important',
        borderWidth: '1px',
        fontSize: 18,
    },
    input: {
        color: 'white',
        fontSize: 18,
    },
    underline: {
        '&:before': {
            borderBottomColor: 'lightgrey',
        },
        '&:after': {
            borderBottomColor: 'lightgrey',
        },
        '&:hover:before': {
            borderBottomColor: ['lightgrey', '!important'],
        },
    },
    button: {
        marginTop: '2%',
        marginLeft: '20%',
        marginRight: '20%',
    },
    error: {
        fontSize: 15,
    },
    loginError: {
        marginTop: '2%',
    },
});

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false,
            error: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let c = this.context;
        c.logout();
    }

    handleChange = fieldName => event => {
        this.submitted = false;
        const { value } = event.target;
        this.setState({ [fieldName]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        let c = this.context;

        this.setState({ submitted: true });
        const { username, password } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }

        userService.login(username, password)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    c.login();
                    c.setUser(user);
                    this.props.history.push(from);
                    this.props.action();
                },
                error => this.setState({ error })
            );
    }

    render() {
        const { classes } = this.props;

        const { username, password, submitted, error } = this.state;
        return (
            <div className="LoginPage">
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>Inloggen</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                            <TextField
                                required
                                id="username"
                                label="Gebruikersnaam"
                                className={classes.textField}
                                error={submitted && !username}
                                helperText={submitted && !username && "Gebruikersnaam is verplicht"}
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                FormHelperTextProps={{
                                    classes: {
                                        error: classes.error
                                    }
                                }}
                                fullWidth={true}
                                value={username}
                                onChange={this.handleChange('username')}
                                margin="normal"
                            />
                            <TextField
                                required
                                id="password"
                                label="Wachtwoord"
                                className={classes.textField}
                                error={submitted && !password}
                                helperText={submitted && !password && "Wachtwoord is verplicht"}
                                type="Password"
                                InputLabelProps={{
                                    className: classes.inputLabel
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.input,
                                        underline: classes.underline,
                                    }
                                }}
                                FormHelperTextProps={{
                                    classes: {
                                        error: classes.error
                                    }
                                }}
                                fullWidth={true}
                                value={password}
                                onChange={this.handleChange('password')}
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" className={classes.button} fullWidth={true} type="submit">
                                Log in
                            </Button>
                            <Grid item xs={12}>
                                {error && <Typography variant="h4" className={classes.loginError}>{error}</Typography>}
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LoginPage.contextType = UserContext;

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginPage);