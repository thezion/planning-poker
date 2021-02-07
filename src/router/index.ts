import Vue from 'vue';
import VueRouter from 'vue-router';

// components
import Signin from '../views/Signin.vue';
import Main from '../views/Main.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/:room',
    name: 'Main',
    component: Main,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
