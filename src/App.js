import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import { SongsPage } from './SongsPage/SongsPage';
import { SongDetail } from './SongDetail/SongDetail';
import { About } from './About/About';
import { UserContext } from './user-context';
import './App.css';

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
    const { text } = this.state;

    return (
      <div className="App">
        <UserContext.Provider value={this.state}>
          <Router>
            <div>
              <nav hidden={!this.state.loggedIn}>
                <ul>
                  <button onClick={() => { this.changeText() }}>{text}</button>
                  <li className={`${text !== '☰' ? 'menuLink' : 'menuLink-hidden'}`}>
                    <Link to="/">Users</Link>
                  </li>
                  <li className={`${text !== '☰' ? 'menuLink' : 'menuLink-hidden'}`}>
                    <Link to="/songs/">Songs</Link>
                  </li>
                  <li className={`${text !== '☰' ? 'menuLink' : 'menuLink-hidden'}`}>
                    <Link to="/about/">About</Link>
                  </li>
                </ul>
              </nav>
              <div className="login" hidden={!this.state.loggedIn}>
                {loggedIn && user !== null && <div><p>Ingelogd als {user.username}</p><Link to="/login">Logout</Link></div>}
              </div>
              <PrivateRoute exact path="/about" component={About} />
              <PrivateRoute exact path="/songs" component={SongsPage} />
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute exact path="/songs/:id" component={SongDetail} />
              <PrivateRoute exact path="/songs/new" component={SongDetail} />
              <Route path="/login" render={(props) => <LoginPage {...props} action={this.handleLogin} />} />
            </div>
          </Router>
        </UserContext.Provider>
      </div>
    );
  }
}

App.contextType = UserContext;

export default App;
