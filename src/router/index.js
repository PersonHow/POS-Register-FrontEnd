import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/OrderPage',
      name: 'OrderPage',
      component: () => import('../views/OrderPage.vue')
    },
    {
      path: '/BillPage',
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

export default router
