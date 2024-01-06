const isLoggedIn = !!localStorage.getItem("token");
const routes = [
  {
    path: "/login",
    component: () => import("pages/LoginSignUpPage.vue"),
    beforeEnter: (to, from, next) => {
      if (isLoggedIn) {
        next();
      } else {
        next({ path: "/login" });
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
        next({ path: "/login" });
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
        next({ path: "/login" });
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
        next({ path: "/home" });
      } else {
        next({ path: "/login" });
      }
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
