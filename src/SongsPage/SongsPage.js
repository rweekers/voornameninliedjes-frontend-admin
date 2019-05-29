import React from 'react';

class SongsPage extends React.Component {
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
        return (
            <div>
                <h3>Songs</h3>
            </div>
        );
    }
}

export { SongsPage };