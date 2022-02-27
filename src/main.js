import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './vuex';
//login with google dependency
import GAuth from 'vue3-google-oauth2'

//import helpers files to be used as global mixin
import APIHelper from "./helpers/api.js";
import AuthHelper from "./helpers/auth-helper.js";
import MiddlewareHelper from "./helpers/middleware.js"
//import bootstrap5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
//setup google auth credentials
const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;
const gAuthOptions = { clientId: GOOGLE_CLIENT_ID, scope: 'email', prompt: 'consent', fetch_basic_profile: true } 
//import global css file
import "./assets/css/global.css";

createApp({ extends: App, mixins: [APIHelper, MiddlewareHelper, AuthHelper] })
.use(router)
.use(store)
.use(GAuth, gAuthOptions)
.mount('#app');
