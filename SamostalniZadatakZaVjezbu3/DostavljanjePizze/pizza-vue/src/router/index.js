import { createRouter, createWebHistory } from 'vue-router';
import PizzaList from '@/components/PizzaList.vue';
import DetaljiPizze from '@/components/DetaljiPizze.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PizzaList,
  },
  {
    path: '/pizze/:naziv',
    name: 'detalji-pizze',
    component: DetaljiPizze,
    props: true
}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
