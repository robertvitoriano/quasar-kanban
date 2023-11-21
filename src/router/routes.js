const isLoggedIn = !!localStorage.getItem("token");
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
    path: "/",
    component: () =>
      isLoggedIn
        ? import("layouts/MainLayout.vue")
        : import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          isLoggedIn
            ? import("pages/HomePage.vue")
            : import("pages/LoginSignUpPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
