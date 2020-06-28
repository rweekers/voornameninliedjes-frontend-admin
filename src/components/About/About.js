import React from 'react';
import ReactMarkdown from 'react-markdown';
import Typography from '@material-ui/core/Typography';

class About extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        // this.setState({
        //     user: JSON.parse(localStorage.getItem('user')),
        //     users: { loading: true }
        // });
    }

    render() {
        const input = 'Achtergrond *text* en zo.'

        return (
            <div>
            <Typography variant="h3" gutterBottom>About</Typography>
                <ReactMarkdown source={input} />
            </div>
        );
    }
}

export { About };