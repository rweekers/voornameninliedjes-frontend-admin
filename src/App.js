import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import { SongsPage } from './SongsPage/SongsPage';
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
    const text = this.state.text;

    return (
      <div className="App">
        <UserContext.Provider value={this.state}>
          <Router>
            <div>
              <nav hidden={!this.state.loggedIn}>
                <ul>
                  <button onClick={() => { this.changeText() }}>{text}</button>
                  <li hidden={text === '☰'}>
                    <Link to="/">Users</Link>
                  </li>
                  <li hidden={text === '☰'}>
                    <Link to="/songs/">Songs</Link>
                  </li>
                  <li hidden={text === '☰'}>
                    <Link to="/about/">About</Link>
                  </li>
                </ul>
              </nav>
              <div hidden={!this.state.loggedIn}>
                {loggedIn && user !== null && <h1>Hoi {user.username}!</h1>}
              </div>
              <PrivateRoute exact path="/about" component={About} />
              <PrivateRoute exact path="/songs" component={SongsPage} />
              <PrivateRoute exact path="/" component={HomePage} />
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
