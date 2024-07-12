import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkingAreaView from '../views/WorkingAreaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/OrderPage',
      name: 'OrderPage',
      component: () => import('../views/OrderPage.vue')
    },
    {
      path:'/working_area',
      name: "working_area",
      component:WorkingAreaView
    },
    {
      path: '/BillPage',
      name: 'BillPage',
      component: () => import('../views/BillPage.vue')
    }
  ]
})

export default router
