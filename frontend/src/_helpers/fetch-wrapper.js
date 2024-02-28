import { object } from 'yup';
import { store, authActions } from '../_store';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        // if(body){
        //     requestOptions.body = body;

        // }
        if (body) {
            if (body instanceof FormData) {
                // If body is FormData, assume it's multipart form data
                requestOptions.body = body;
            } else {
                // If body is not FormData, assume it's JSON data
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = authToken();
    const isLoggedIn = !!token;
    const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function authToken() {
    return store.getState().auth.value?.access;
}

async function handleResponse(response) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        if ([401, 403].includes(response.status) && authToken()) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            const logout = () => store.dispatch(authActions.logout());
            logout();
            window.location.href = '/account/login'; 
        }

        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        if(data.detail){
            return Promise.reject(data.detail);
            
        }
        let str = '';  
        for (let i in data) {
        if (data.hasOwnProperty(i)) {
            str = str + `<div> ${data[i]}</div>\n`;
        }
        }
        return Promise.reject(str)
    }

    return data;
}