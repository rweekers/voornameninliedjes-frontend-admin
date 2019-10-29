import { authHeader } from '../helpers/auth-headers';
import axios from "axios";

export const songService = {
    getAll,
    getDone,
    getToDo,
    getSong,
    updateSong,
    insertSong,
    removeSong,
    getFlickrPhotoInfo
};

const apiUrl = 'https://admin.voornameninliedjes.nl'
const FLICKR_PHOTO_DETAIL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=9676a28e9cb321d2721e813055abb6dc&format=json&nojsoncallback=true&photo_id=';
const FLICKR_USER_DETAIL = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=9676a28e9cb321d2721e813055abb6dc&format=json&nojsoncallback=true&user_id=';
const FLICKR_LICENCES = 'https://api.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key=9676a28e9cb321d2721e813055abb6dc&format=json&nojsoncallback=true'

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

function getSong(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/songs/${id}`, requestOptions).then(handleResponse);
}

function getFlickrPhotoInfo(flickrId) {
    return axios.get(FLICKR_PHOTO_DETAIL + flickrId)
        .then(res => {
            const photo = res.data.photo;
            return axios.get(FLICKR_USER_DETAIL + photo.owner.nsid)
                .then(res => {
                    const owner = res.data.person;
                    return axios.get(FLICKR_LICENCES)
                        .then(res => {
                            const licenses = res.data.licenses.license;
                            const license = licenses.find(x => x.id === photo.license);
                            const licenseName = license.name;
                            const licenseUrl = license.url;
                            const contribution = {
                                'ownerName': owner.username._content,
                                'ownerUrl': owner.photosurl._content,
                                'photoTitle': photo.title._content,
                                'photoUrl': photo.urls.url[0]._content,
                                'licenseName': licenseName,
                                'licenseUrl': licenseUrl
                            };
                            photo.contribution = contribution;
                            return photo;
                        }).catch(function (error) {
                            return Promise.reject(error);
                        });
                }).catch(function (error) {
                    return Promise.reject(error);
                });
        }).catch(function (error) {
            return Promise.reject(error);
        });
}

function updateSong(song, user) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(song),
        headers: authHeader()
    };
    const id = song.id;
    const username = user.username;
    return fetch(`${apiUrl}/songs/${username}/${id}`, requestOptions).then(handleResponse);
}

function insertSong(song, user) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(song),
        headers: authHeader()
    };
    const username = user.username;
    return fetch(`${apiUrl}/songs/${username}`, requestOptions).then(handleResponse);
}

function removeSong(songId) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${apiUrl}/songs/${songId}`, requestOptions).then(handleResponse);
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