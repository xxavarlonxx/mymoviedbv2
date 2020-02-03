import Vue from 'vue';
import router from './router'
import axios from 'axios'
import store from './store'

const http = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

http.interceptors.request.use(config => {
    const token = store.getters.token
    if (token && !config.url.includes('/login')) {
        config.headers["Authorization"] = "Bearer " + token
    }
    return config
}, error => {
    Promise.reject(error)
})

http.interceptors.response.use(response => {
    return response;
}, 
/*error => {
    if (error.response.status === 401) {
        router.push('login');

    }

    return Promise.reject(error)
}*/
)


Vue.prototype.$http = http
