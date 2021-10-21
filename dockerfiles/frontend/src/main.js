import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'

import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

const socket = io(`${location.hostname}:4000/`, {transports: ['websocket']});


createApp(App)
    .use(VueSocketIOExt, socket)
    .mount('#app')
