import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/OrderPage",
      name: "OrderPage",
      component: () => import("../views/OrderPage.vue"),
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/OrderPage',
      name: 'OrderPage',
      component: () => import('../views/OrderPage.vue')
    },
    {
      path: '/BillPage/:orderId',
      name: 'BillPage',
      component: () => import('../views/BillPage.vue')
    },
    {
      path: '/InvoicePage',
      name: 'InvoicePage',
      component: () => import('../views/InvoicePage.vue')
    }
  ]
})

export default router; // 導出路由器