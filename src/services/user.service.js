import { authHeader } from '../helpers/auth-headers';
import axios from 'axios';

export const userService = {
    login,
    logout,
    getAll
};

// const apiUrl = 'http://localhost:4000'
const apiUrl = 'http://admin.voornameninliedjes.nl'

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${apiUrl}/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                console.log('Login failed, logging out now')
                logout();
                window.location.reload(true);
            }

            const error2 = (data && data.message) || response.statusText;
            const error = response.statusText;
            console.log('error ' + error);
            console.log('response status ' + response.status);
            return Promise.reject(error);
        }

        return data;
    });
}