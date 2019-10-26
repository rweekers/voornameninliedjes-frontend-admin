import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import SongsPage from './SongsPage/SongsPage';
import SongDetail from './SongDetail/SongDetail';
import { About } from './About/About';
import { UserContext } from './user-context';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchAppBar from './material-coponents/SearchAppBar';
import { createBrowserHistory as createHistory } from 'history';
import './App.css';

const styles = theme => ({
  button: {
    color: 'white'
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);

    this.logout = () => {
      this.setState(state => ({
        loggedIn: false
      }));
    };

    this.login = () => {
      this.setState(state => ({
        loggedIn: true
      }));
    };

    this.setUser = (newUser) => {
      this.setState(state => ({
        user: newUser
      }));
    }

    this.state = {
      user: {},
      loggedIn: false,
      logout: this.logout,
      login: this.login,
      setUser: this.setUser,
      text: '☰'
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'))
    const loggedIn = user !== null

    this.setState({
      user: user,
      loggedIn: loggedIn
    });
  }

  changeText = () => {
    if (this.state.text === '☰') {
      this.setState({ text: 'x' });
    } else {
      this.setState({ text: '☰' });
    }
  }

  handleLogin() {
    this.setState({ loggedIn: true })
  }

  render() {
    const user = this.state.user;
    const loggedIn = this.state.loggedIn;

    const { classes } = this.props;

    return (
      <div className="App">
        <UserContext.Provider value={this.state}>
          <Router>
            <div>
              <SearchAppBar loggedOut={!this.state.loggedIn} />
              <div className="login" hidden={!this.state.loggedIn}>
                {loggedIn && user !== null && <div><Typography variant="subtitle1" gutterBottom>Ingelogd als {user.username} <Link to="/login"><Button className={classes.button}>Uitloggen</Button></Link></Typography></div>}
              </div>
              <Switch>
                <PrivateRoute exact path="/about" component={About} />
                <PrivateRoute exact path="/songs" component={SongsPage} />
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/songs/:id" component={SongDetail} />
                <PrivateRoute exact path="/songs/new" component={SongDetail} />
                <Route path="/login" render={(props) => <LoginPage {...props} action={this.handleLogin} />} />
              </Switch>
            </div>
          </Router>
        </UserContext.Provider>
      </div>
    );
  }
}

App.contextType = UserContext;

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const history = createHistory();

export default withStyles(styles)(App);
