import { API_BASE_URL, ACCESS_TOKEN } from '../constant';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response =>
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function addShowByTitle(title) {
    return request({
        url: API_BASE_URL + "/show/" + title,
        method: 'POST'
    });
}

export function getAllShow() {
    return request({
        url: API_BASE_URL + "/show/all",
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(id) {
    return request({
        url: API_BASE_URL + "/user/" + id,
        method: 'GET'
    });
}

export function likeShow(id) {
    return request({
        url: API_BASE_URL + "/show/like/" + id,
        method: 'POST'
    });
}

export function getShowById(id) {
    return request({
        url: API_BASE_URL + "/show/id/" + id,
        method: 'GET'
    });
}

export function getOrderedShows(order, page) {
    return request({
        url: API_BASE_URL + "/show/" + order + "/" + page,
        method: 'GET'
    });
}

export function addComment(showId, comment) {
    return request({
        url: API_BASE_URL + "/comment/" + showId + "/" + comment,
        method: 'POST'
    });
}

export function searchShows(title) {
    return request({
        url: API_BASE_URL + "/show/search/" + title,
        method: 'GET'
    });
}

export function trackEpisode(episodeId) {
    return request({
        url: API_BASE_URL + "/track/episode/" + episodeId,
        method: 'POST'
    });
}

export function trackSeason(seasonId) {
    return request({
        url: API_BASE_URL + "/track/season/" + seasonId,
        method: 'POST'
    });
}
