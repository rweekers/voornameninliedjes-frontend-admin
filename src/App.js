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

    this.setUser = (user) => {
      this.setState(state => ({
        loggedIn: state.loggedIn
      }));
    };
    this.state = {
      user: {},
      loggedIn: false
    };
  }

  componentDidMount() {
    console.log(this.state.loggedIn);
    this.setState({
      user: JSON.parse(localStorage.getItem('user'))
    });
  }

  handleLogin() {
    this.setState({ loggedIn: true })
  }

  render() {
    const user = this.state.user;
    console.log(this.state.loggedIn + 'a');
    return (
      <div className="App">
        <UserContext.Provider value={this.state}>
          <Router>
            <div>
              <nav hidden={!this.state.loggedIn}>
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
              <div hidden={!this.state.loggedIn}>
                {/* <h1>Hoi {user.username}!</h1> */}
                <h1>Logged in {this.state.loggedIn + 'a'}</h1>
              </div>
              <PrivateRoute exact path="/about" component={About} />
              <PrivateRoute exact path="/songs" component={Songs} />
              <PrivateRoute exact path="/" component={HomePage} />
              <Route path="/login" render={(props) => <LoginPage {...props} action={this.handleLogin} />} />
            </div>
          </Router>
        </UserContext.Provider>
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
