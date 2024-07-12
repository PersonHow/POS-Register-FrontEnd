import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/OrderPage',
      name: 'OrderPage',
      component: () => import('../views/OrderPage.vue')
    },
    {
      path: "/Reserve", // 路徑為 /Reserve
      name: "Reserve", // 名稱為 Reserve
      component: () => import("../components/Reserve.vue"), // 使用動態 import 載入 "../components/Reserve.vue" 元件
    },
    {
      path: "/OrderList", // 路徑為 /OrderList
      name: "OrderList", // 名稱為 OrderList
      component: () => import("../components/OrderList.vue"), // 使用動態 import 載入 "../components/OrderList.vue" 元件
    },
    ,
    {
      path: "/Login", // 路徑為 /Login
      name: "Login", // 名稱為 Login
      component: () => import("../components/Login.vue"), // 使用動態 import 載入 "../components/Login.vue" 元件
    },
  ]
})

export default router; // 導出路由器