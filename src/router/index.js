import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: import("../views/HomeView.vue"),
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
      path: "/workingarea",
      name: "workingarea",
      component: () => import("../views/KitchenPage.vue"),
    },
    {
      path: "/BillPage/:orderId",
      name: "BillPage",
      component: () => import("../views/BillPage.vue"),
    },
    {
      path: "/AllBillPage",
      name: "AllBillPage",
      component: () => import("../views/AllBillPage.vue"),
    },
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
    {
      path: "/AllBillPage",
      name: "AllBillPage",
      component: () => import("../views/AllBillPage.vue"),
    },
  ],
});
export default router; // 導出路由器
