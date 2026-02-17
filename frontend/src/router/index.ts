import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/modules/service-orders/views/HomeView.vue"),
  },
  {
    path: "/service-orders",
    name: "ServiceOrders",
    component: () =>
      import("@/modules/service-orders/views/ServiceOrdersView.vue"),
  },
  {
    path: "/service-orders/:id",
    name: "ServiceOrderDetails",
    component: () =>
      import("@/modules/service-orders/views/ServiceOrderDetailsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

