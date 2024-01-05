const isLoggedIn = !!localStorage.getItem("token");
const routes = [
  {
    path: "/login",
    component: () => import("pages/LoginSignUpPage.vue"),
    beforeEnter: (to, from, next) => {
      if (isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: (to, from, next) => {
      if (isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    },
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
      },
    ],
  },
  {
    path: "/boards-selection",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: (to, from, next) => {
      if (isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    },
    children: [
      {
        path: "",
        component: () => import("pages/BoardsSelection.vue"),
      },
    ],
  },
  {
    path: "/",
    beforeEnter: (to, from, next) => {
      if (isLoggedIn) {
        next("/home");
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
