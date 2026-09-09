import { createRouter, createWebHistory } from 'vue-router'
import MatchView from '@/views/MatchView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: MatchView },
    { path: '/settings', name: 'settings', component: MatchView },
    { path: '/help', name: 'help', component: MatchView },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
