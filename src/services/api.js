import { getUser } from "./utils.js";

const appId = 'tjiUUEFUPNo5kHHbbKaEpNLdWUGjGxzRkpAdDPDo';
const apiKey = 'ZckwBVBAqXtmpmZxE0MdbHmjFhFzauDno2OY2gy4';

async function request(method, url, data) {
    let options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-JavaScript-Key': apiKey
        },
    };

    if (data) {
        options.headers['Content-type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const user = getUser();
    if (user) {
        options.headers['X-Parse-Session-Token'] = user.sessionToken;
    }

    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            let error = await response.json();
            throw new Error(error.message);
        }

        if (response.status == 204) {
            return response;
        }

        let result = await response.json();
        return result;
    } catch (error) {
        alert(`Error: ${error.message}`)
        throw error;
    }

}

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const deleteReq = request.bind(null, 'DELETE');