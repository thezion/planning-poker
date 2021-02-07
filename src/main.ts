import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faEllipsisH, faWifi, faUserCircle, faThumbsUp, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserCircle);
library.add(faCheckCircle);
library.add(faEllipsisH);
library.add(faThumbsUp);
library.add(faWifi);
library.add(faCog);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
