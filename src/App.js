import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // TODO check, use different way, this will share between different windows
    window.addEventListener('storage', function (e) {
      console.log('Woohoo, someone changed my localstorage va another tab/window!');
    });
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    this.setState({
      user: JSON.parse(localStorage.getItem('user'))
    });
  }

  render() {
    const user = this.state.user;
    return (
      <div className="App">
        <Router>
          <div>
            <nav hidden={user == null}>
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
            {/* <div show={user}>
              <h1>Hoi {user.username}!</h1>
            </div> */}
            <PrivateRoute exact path="/about" component={About} />
            <PrivateRoute exact path="/songs" component={Songs} />
            <PrivateRoute exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
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

export default App;
