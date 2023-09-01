import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/router'
import Store from './store/store'
import setAuthToken from "@/utils/authToken";
import axios from "axios";
import router from "./router/router";
import io from 'socket.io-client';
import moment from "moment";
// const io = require("socket.io-client");

// let socket = null
const socket = io("http://localhost:5000")
Store.dispatch('assignSocket', socket)

/** Check for auth token on refresh and set authorization header for incoming requests */
if (localStorage.authToken) {
    setAuthToken(localStorage.authToken);
} else {
    setAuthToken(null);
}
/** Axios Request Intercept */
axios.interceptors.request.use(
    function(config) {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    function(err) {
        return Promise.reject(err);
    }
);

/** Axios Response Intercept */
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(err) {
        if (err.response.status === 401) {
            localStorage.removeItem('authToken');
            Store.dispatch('toggleAuthState', false);
            router.push({
                name: 'Login',
                params: { message: 'Session has expired, please login again' }
            });
        }
        return Promise.reject(err);
    }
);

const app = createApp(App)
app.config.isCustomElement = (tag) => tag.startsWith('ion-')
app.config.globalProperties.$socket = socket;

app.provide("moment", moment)
app.use(Router)
app.use(Store)
app.mount('#app')
