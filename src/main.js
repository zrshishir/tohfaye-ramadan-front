import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index';
import { purgeLegacyKeys } from '@/services/cache';

// The app used to write un-expiring ad-hoc localStorage keys. Left behind they would
// keep stale content on device forever, so they are dropped once on startup.
purgeLegacyKeys();

const app = createApp(App);

app.use(router);

app.mount('#app');
