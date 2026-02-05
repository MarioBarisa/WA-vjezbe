// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/authService';

import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue'; 

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } 
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = authService.isLoggedIn();

  if (to.meta.requiresAuth && !isLoggedIn) {
    //  ruta zahtijeva autentifikacij =>  korisnik nije prijavljen
    next('/login');
  } else if (to.meta.requiresGuest && isLoggedIn) {
    //  korisnik pokušava pristupiti login/register stranici => a već je prijavljen
    next('/');
  } else {
    next();
  }
});

export default router;
