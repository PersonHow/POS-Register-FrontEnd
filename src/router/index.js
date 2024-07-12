import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/OrderPage",
      name: "OrderPage",
      component: () => import("../views/OrderPage.vue"),
    },
    {
      path: "/workingarea",
      name: "workingarea",
      component: () => import("../views/WorkingAreaView.vue"),
    },
    {
      path: "/BillPage",
      name: "BillPage",
      component: () => import("../views/BillPage.vue"),
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
        sessionStorage.setItem("token", null);
        alert("登出成功！");
        window.location.replace("/");
      },
    },
  ],
});

export default router;
