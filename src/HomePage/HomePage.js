import React from 'react';
import Typography from '@material-ui/core/Typography';
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
        const { users } = this.state;
        return (
            <div>
                <Typography variant="h3" gutterBottom>Gebruikers</Typography>
                {users.length &&
                    <ul>
                        {users.map((user, index) =>
                            <li key={user.id}>
                                <Typography variant="h5" gutterBottom>{user.username} - {user.roles[0]}</Typography>
                            </li>
                        )}
                    </ul>
                }
            </div>
        );
    }
}

export { HomePage };