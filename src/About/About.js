import React from 'react';
import ReactMarkdown from 'react-markdown';

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
                <h3>About</h3>
                <ReactMarkdown source={input} />
            </div>
        );
    }
}

export { About };