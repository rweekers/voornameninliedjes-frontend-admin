import React from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/user.service';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            users: []
        };
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
            users: { loading: true }
        });
        userService.getAll().then(users => this.setState({ users }));
    }

    render() {
        const { user, users } = this.state;
        return (
            <div>
                <h3>Users from secure api end point:</h3>
                {users.length &&
                    <ul>
                        {users.map((user, index) =>
                            <li key={user.id}>
                                {user.username} - {user.roles[0]}
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

export { HomePage };