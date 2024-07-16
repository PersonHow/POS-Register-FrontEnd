import { createRouter, createWebHistory } from "vue-router";
import Swal from "sweetalert2";
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
      path: "/InvoicePage",
      name: "InvoicePage",
      component: () => import("../views/InvoicePage.vue"),
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../views/Calendar.vue"),
    },
    {
      path: "/reserve",
      name: "reserve",
      component: () => import("../views/ReservationPage.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => {
        sessionStorage.removeItem("token");
        Swal.fire({
          title: "登出成功！",
          showConfirmButton: true,
          confirmButtonColor: "#00c5c8",
          confirmButtonText: "確定",
          icon: "success",
          iconColor: "#00c5c8",
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.replace("/");
          }
        });
      },
    },
  ],
});
export default router; // 導出路由器
