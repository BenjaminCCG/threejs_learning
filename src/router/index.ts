import { createWebHashHistory, createRouter } from 'vue-router';
import Home from '@/pages/home/index.vue';
import Tech from '@/pages/tech/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/tech',
      name: 'Tech',
      component: Tech
    }
  ]
});

export default router;
