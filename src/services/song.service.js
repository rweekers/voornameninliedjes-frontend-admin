import { authHeader } from '../helpers/auth-headers';

export const songService = {
    getAll,
    getDone,
    getToDo
};

const apiUrl = 'http://admin.voornameninliedjes.nl'

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/songs`, requestOptions).then(handleResponse);
}

function getDone() {
    return getAll();
}

function getToDo() {
    return getAll();
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = `${response.status} ${data.message}`
            return Promise.reject(error);
        }

        return data;
    });
}