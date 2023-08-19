import { createApp } from 'vue'
import App from './App.vue'
import Router from './router/router'
import Store from './store/store'
import setAuthToken from "@/utils/authToken";
import axios from "axios";
import store from "./store/store";
import router from "./router/router";
// import { IonicVue } from '@ionic/vue';
/* Core CSS required for Ionic components to work properly */
// import '@ionic/vue/css/core.css';
//

const app = createApp(App)
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
            store.dispatch('toggleAuthState', false);
            router.push({
                name: 'Login',
                params: { message: 'Session has expired, please login again' }
            });
        }
        return Promise.reject(err);
    }
);
app.config.isCustomElement = (tag) => tag.startsWith('ion-')

app.use(Router)
app.use(Store)
app.mount('#app')
