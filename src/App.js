import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import { UserContext } from './user-context';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);

    // TODO check, use different way, this will share between different windows
    window.addEventListener('storage', function (e) {
      console.log('Woohoo, someone changed my localstorage va another tab/window!');
    });
    this.state = {
      user: {},
      loggedIn: false
    };
  }

  componentDidMount() {
    console.log(React.version);
    this.setState({
      user: JSON.parse(localStorage.getItem('user'))
    });
  }

  handleLogin() {
    this.setState({ loggedIn: true })
  }

  render() {
    const user = this.state.user;
    const loggedIn = this.state.loggedIn;
    let userTheme = this.context;
    return (
      <div className="App">
        <Router>
          <div>
            <nav hidden={!loggedIn}>
              <ul>
                <li>
                  <Link to="/">Users</Link>
                </li>
                <li>
                  <Link to="/songs/">Songs</Link>
                </li>
                <li>
                  <Link to="/about/">About</Link>
                </li>
              </ul>
            </nav>
            <div hidden={!loggedIn}>
              <h1>Hoi {userTheme.user.username}!</h1>
            </div>
            <div>
              <UserContext.Consumer>
                {({ user, setUser }) => (
                  <div>
                    <button
                      onClick={setUser}>
                      Toggle Theme</button>
                    <p>{user.username}</p>
                  </div>
                )}
              </UserContext.Consumer>
            </div>
            <PrivateRoute exact path="/about" component={About} />
            <PrivateRoute exact path="/songs" component={Songs} />
            <PrivateRoute exact path="/" component={HomePage} />
            <Route path="/login" render={(props) => <LoginPage {...props} action={this.handleLogin} />} />
          </div>
        </Router>
      </div>
    );
  }
}

function Songs() {
  return <h2>Songs</h2>;
}

function About() {
  return <h2>About</h2>;
}

App.contextType = UserContext;

export default App;
