import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/table",
      name: "table",
      component: () => import("../views/TablePage.vue"),
    },
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
>>>>>>>>> Temporary merge branch 2
      path: "/BillPage",
      name: "BillPage",
      component: () => import("../views/BillPage.vue"),
    },
    {
      path: '/InvoicePage',
      name: 'InvoicePage',
      component: () => import('../views/InvoicePage.vue')
    }
  ]
})

export default router; // 導出路由器
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../views/Calendar.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => {
        sessionStorage.removeItem("token");
        alert("登出成功！");
        window.location.replace("/");
      },
    },
  ],
});
export default router; // 導出路由器
