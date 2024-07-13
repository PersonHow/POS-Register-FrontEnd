import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/OrderPage",
      name: "OrderPage",
      component: () => import("../views/OrderPage.vue"),
    },
    {
      path: "/BillPage",
      name: "BillPage",
      component: () => import("../views/BillPage.vue"),
    },
    {
      path: "/Reserve",
      name: "Reserve",
      component: () => import("../components/TsaiChunHao/Reserve.vue"),
    },
    {
      path: "/ReserveList",
      name: "ReserveList",
      component: () => import("../components/TsaiChunHao/ReserveList.vue"),
    },
    {
      path: "/Login",
      name: "Login",
      component: () => import("../components/TsaiChunHao/Login.vue"),
    },
  ]
})

export default router; // 導出路由器