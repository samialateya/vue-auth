import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './vuex';

//import helpers files to be used as global mixin
import APIHelper from "./helpers/api.js";
import AuthHelper from "./helpers/auth-helper.js";
import MiddlewareHelper from "./helpers/middleware.js"
//import bootstrap5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

//import global css file
import "./assets/css/global.css";

createApp({ extends: App, mixins: [APIHelper, MiddlewareHelper, AuthHelper] })
.use(router)
.use(store)
.mount('#app');
