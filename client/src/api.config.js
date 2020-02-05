import Vue from 'vue';
import axios from 'axios';
import store from './store';

let http = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})


http.interceptors.request.use(config => {
    const token = store.getters.token
    console.log(token)
    if (token && !config.url.includes('/login')) {
        config.headers["Authorization"] = "Bearer " + token
    }
    return config
}, error => {
    console.log('Error:'+ error)
    Promise.reject(error)
})

http.interceptors.response.use(response => response, error => {
    if (error.response.status === 401) {
        router.push('login');

    }
    return Promise.reject(error)
}) 

export default http;

