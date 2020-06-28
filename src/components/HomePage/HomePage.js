import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { userService } from '../../services/user.service';

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
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>Gebruikers</Typography>
                    </Grid>
                    {users.length && users.map((user, index) =>
                        <Grid item xs={12} key={user.id}>
                            <Typography variant="subtitle1" gutterBottom>{user.username} - {user.roles.join()}</Typography>
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
}

export { HomePage };