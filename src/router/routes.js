const isLoggedIn = !!localStorage.getItem("token");

const requireAuth = (to, from, next) => {
  if (isLoggedIn) {
    next();
  } else {
    next({ path: "/login" });
  }
};

const routes = [
  {
    path: "/login",
    component: () => import("pages/LoginSignUpPage.vue"),
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
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
        next({ path: "/boards-selection" });
      } else {
        next({ path: "/login" });
      }
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/LoginSignUpPage.vue"),
  },
];

export default routes;
